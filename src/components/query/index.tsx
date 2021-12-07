import { Panel } from '@components/panel'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import * as monaco from 'monaco-editor'
import { LANGUAGE_ID } from 'monaco-graphql'
import React, { useContext, useEffect } from 'react'
import { Runner } from '../runner'
import { setGraphqlAPI, setSchemaUri } from './helper'
import './index.css'

export const Query = function Editor() {
  const { state, dispatch } = useContext(AppCtx)
  const editor = useEditor('#query-editor', {
    language: LANGUAGE_ID,
    value: state.query,
    theme: 'egert',
  })

  useEffect(() => {
    setGraphqlAPI()
  }, [])

  useEffect(() => {
    setSchemaUri(state.schemaUrl)
  }, [state.schemaUrl])

  useEffect(() => {
    if (!editor) return
    // 设置 queryEditor 全局属性
    dispatch({ type: 'queryEditor', payload: editor })
    editor.onDidChangeModelContent(() => {
      dispatch({ type: 'query', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  useEffect(() => {
    if (!editor) return
    editor.addAction({
      id: '补全提示',
      label: '补全提示',
      keybindings: [monaco.KeyMod.WinCtrl | monaco.KeyMod.Shift | monaco.KeyCode.US_SLASH],
      contextMenuGroupId: 'navigation',
      run() {
        editor.trigger('source', 'editor.action.triggerSuggest', {})
      },
    })
  }, [editor])

  const onResize = () => {
    window.dispatchEvent(new UIEvent('resize'))
  }
  const [{ name = '查询' } = {}] = state.openedFileList

  return (
    <Panel className="query-panel" name={name} headerRight={<Runner editor={editor} />} onResize={onResize}>
      <div id="query-editor"></div>
    </Panel>
  )
}
