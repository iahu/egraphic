import { ObjectType } from '@state/'
import * as graphql from 'graphql'
import * as monaco from 'monaco-editor'
import { api as GraphQLAPI } from 'monaco-graphql'

export const getSchema = () =>
  GraphQLAPI.getSchema().then(schema => {
    if (schema) {
      if (typeof schema === 'string') {
        return graphql.buildSchema(schema)
      } else if ('__schema' in schema) {
        return graphql.buildClientSchema(schema)
      }
      return graphql.buildASTSchema(schema)
    }
    return Promise.reject(new Error('cant find schema'))
  })

export const parseJSON = <T = unknown>(str: string) => {
  return new Promise<T>((resolve, reject) => {
    try {
      resolve(JSON.parse(str.trim()))
    } catch (err) {
      reject(err)
    }
  })
}

export type RequestOptions = {
  url: string
  query: string
  operationName?: string
  variables?: ObjectType
  headers?: ObjectType
}

export type GraphqlErrorResponse = {
  message: string
  locations: { line: number; column: number }[]
  path: (string | number)[]
}

export type GraphqlResponse<T extends ObjectType> = {
  data: T
  errors: GraphqlErrorResponse[]
}

function request<T>(options: RequestOptions): Promise<GraphqlResponse<T>>
function request<T>(
  url: string,
  query: string,
  variables?: ObjectType,
  headers?: ObjectType,
  operationName?: string,
): Promise<GraphqlResponse<T>>
function request<T>(
  url: string | RequestOptions,
  query?: string,
  variables?: ObjectType,
  headers?: ObjectType,
  operationName?: string,
) {
  if (typeof url === 'object') {
    ;({ url, query, variables, headers, operationName } = url)
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query,
      operationName,
      variables,
    }),
  }).then(r => r.json()) as Promise<GraphqlResponse<T>>
}

export { request }

export const isOprationNode = (node: graphql.DefinitionNode): node is graphql.OperationDefinitionNode =>
  node.kind === graphql.Kind.OPERATION_DEFINITION

export const lineInNode = <T extends graphql.DefinitionNode>(lineNumber: number, node: T) => {
  const { loc } = node
  if (!loc) return false
  const startLine = loc.startToken.line
  const endLine = loc.endToken.line
  return startLine <= lineNumber && lineNumber <= endLine
}

/**
 * 获取某行源码所属的操作节点 AST 信息
 */
export const getOperationNode = (
  editor: monaco.editor.IStandaloneCodeEditor,
  lineNumber?: number,
): graphql.OperationDefinitionNode | undefined => {
  const line = lineNumber ?? editor.getPosition()?.lineNumber ?? -1
  const source = editor.getValue()
  const { definitions } = graphql.parse(source)
  const containsLine = lineInNode.bind(null, line)

  return definitions.filter(isOprationNode).filter(containsLine).pop()
}

export const getNodeRange = (node?: graphql.DefinitionNode) => {
  const { start = 0, end = 0 } = node?.loc ?? {}
  return { start, end }
}

export const getQueryString = (node?: graphql.DefinitionNode) => {
  if (!node) {
    return ''
  }

  const { start, end } = getNodeRange(node)
  return node?.loc?.source.body.slice(start, end)
}
