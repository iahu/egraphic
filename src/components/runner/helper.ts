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

export const request = (
  gql: string,
  variable: string,
  rootValue?: Record<string, any>,
  contextValue?: Record<string, any>,
) => {
  return Promise.all([parseJSON<Record<string, any>>(variable), getSchema()])
    .then(([variableValues, schema]) => {
      const document = graphql.parse(gql)
      return { document, schema, variableValues, rootValue, contextValue }
    })
    .then(graphql.execute)
}

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
