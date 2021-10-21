import { Btn } from '@components/btn'
import { AppCtx } from '@state/app-ctx'
import * as graphql from 'graphql'
import * as monaco from 'monaco-editor'
import React, { FC, useContext, useEffect, useState } from 'react'
import { request, gql } from 'graphql-request'
import './index.css'
import { parseJSON, getNodeRange, getOperationNode } from './helper'

export interface Props {
  editor?: monaco.editor.IStandaloneCodeEditor
}

export const Runner: FC<Props> = props => {
  const { editor } = props
  const { state, dispatch } = useContext(AppCtx)
  const { variableValues, headers } = state
  const [node, setNode] = useState<graphql.OperationDefinitionNode>()
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (editor) {
      const { start, end } = getNodeRange(getOperationNode(editor))
      parseJSON(variableValues)
        .then(variableValues => {
          const query = gql`
            ${editor.getValue().slice(start, end)}
          `
          return request(state.schemeUrl, query, variableValues, headers)
        })
        .then(response => {
          dispatch({ type: 'response', payload: JSON.stringify(response, null, 2) })
        })
    }
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
      {node ? `${node.name?.value ?? 'query'} ➜` : '无操作'}
    </Btn>
  )
}
