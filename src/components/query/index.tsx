import { Panel } from '@components/panel'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import { LANGUAGE_ID } from 'monaco-graphql'
import React, { useContext, useEffect } from 'react'
import { Runner } from '../runner'
import { Header } from './header'
import { setGraphqlAPI, setSchemaUri } from './helper'
import './index.css'

export const Query = function Editor() {
  const { state, dispatch } = useContext(AppCtx)
  const editor = useEditor('#query-editor', {
    language: LANGUAGE_ID,
    value: state.operation,
  })

  useEffect(() => {
    setGraphqlAPI()
  }, [])

  useEffect(() => {
    setSchemaUri(state.schemaUrl)
  }, [state.schemaUrl])

  useEffect(() => {
    if (!editor) return
    editor.onDidChangeModelContent(() => {
      dispatch({ type: 'operation', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  return (
    <Panel className="query-panel" header={<Header />} headerRight={<Runner editor={editor} />}>
      <div id="query-editor"></div>
    </Panel>
  )
}
