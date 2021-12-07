import { Btn } from '@components/btn'
import { IconBtn } from '@components/icon-btn'
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
  const handleClick = (e: React.MouseEvent | Event) => {
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

  useEffect(() => {
    if (editor) {
      window.addEventListener('save', handleClick)
      return () => {
        window.removeEventListener('save', handleClick)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <div className="runner">
      <span className="operation-name">{node ? node.name?.value ?? 'query' : '无操作'}</span>
      <IconBtn title="ctrl/cmd - s" id="icon-send" disabled={!node} onClick={handleClick} size={14} />
    </div>
  )
}
