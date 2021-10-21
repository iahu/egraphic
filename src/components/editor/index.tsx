import { Panel } from '@components/panel'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import { LANGUAGE_ID } from 'monaco-graphql'
import React, { useContext, useEffect } from 'react'
import { Runner } from '../runner'
import { Header } from './header'
import { configGraphqlAPI } from './helper'
import './index.css'

export const Editor = function Editor() {
  const { state, dispatch } = useContext(AppCtx)
  const editor = useEditor('#editor-container', {
    language: LANGUAGE_ID,
    value: state.operation,
  })

  useEffect(() => {
    configGraphqlAPI(state.schemeUrl)
  }, [state.schemeUrl])

  useEffect(() => {
    if (editor) editor.layout()
  }, [state.variableVisable, state.docsVisable, editor])

  useEffect(() => {
    editor?.onDidChangeModelContent(() => {
      dispatch({ type: 'operation', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  return (
    <Panel className="operation-editor" header={<Header />} headerRight={<Runner editor={editor} />}>
      <div id="editor-container"></div>
    </Panel>
  )
}
