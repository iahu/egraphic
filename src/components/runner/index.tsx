import { Btn } from '@components/btn'
import stringify from '@helper/stringify'
import { AppCtx } from '@state/app-ctx'
import * as graphql from 'graphql'
import * as monaco from 'monaco-editor'
import React, { FC, useContext, useEffect, useState } from 'react'
import { getOperationNode, getQueryString, parseJSON, request } from './helper'
import './index.css'

export interface Props {
  editor?: monaco.editor.IStandaloneCodeEditor
}

export const Runner: FC<Props> = props => {
  const { editor } = props
  const { state, dispatch } = useContext(AppCtx)
  const { variable, headers } = state
  const [node, setNode] = useState<graphql.OperationDefinitionNode>()
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!editor) return dispatch({ type: 'response', payload: '未找到到可查询内容' })

    const op = getOperationNode(editor)
    const query = getQueryString(op)
    if (!op || !query) return dispatch({ type: 'response', payload: '无匹配的查询操作' })
    const variableValues = parseJSON<Record<string, any>>(variable).catch(() => ({}))

    dispatch({ type: 'responseStatus', payload: 'pending' })
    dispatch({ type: 'operationName', payload: op.name?.value ?? '' })
    variableValues
      .then(variableValues => request(state.schemaUrl, query, variableValues, headers))
      .then(response => {
        dispatch({ type: 'response', payload: stringify(response) })
        dispatch({ type: 'responseStatus', payload: 'ok' })
      })
      .catch(err => {
        dispatch({ type: 'response', payload: JSON.stringify(err, null, 2) })
        dispatch({ type: 'responseStatus', payload: 'error' })
      })
  }

  useEffect(() => {
    if (editor) {
      editor.onDidChangeCursorPosition(() => {
        setNode(getOperationNode(editor))
      })
    }

    return () => setNode(undefined)
  }, [editor])

  return (
    <Btn className="runner" title="ctrl/cmd - enter" disabled={!node} onClick={handleClick}>
      <span className="operation-name">{node ? node.name?.value ?? 'query' : 'no operation'}</span>
      {node && <span className="operation-arrow">➜</span>}
    </Btn>
  )
}
