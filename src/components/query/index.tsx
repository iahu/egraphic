import { Panel } from '@components/panel'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import * as monaco from 'monaco-editor'
import { LANGUAGE_ID } from 'monaco-graphql'
import { parse, visit, Kind } from 'graphql/language'
import React, { useContext, useEffect } from 'react'
import { Runner } from '../runner'
import { Header } from './header'
import { setGraphqlAPI, setSchemaUri } from './helper'
import './index.css'
import { getSchema } from '@components/runner/helper'

export const Query = function Editor() {
  const { state, dispatch } = useContext(AppCtx)
  const editor = useEditor('#query-editor', {
    language: LANGUAGE_ID,
    value: state.query,
    theme: 'vs-dark',
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

  // useEffect(() => {
  //   if (!editor) return
  //   /**
  //    * @todo hover 提示 GraphQL type
  //    */
  //   monaco.languages.registerHoverProvider(LANGUAGE_ID, {
  //     provideHover(model, position) {
  //       const ast = parse(model.getValue())
  //       const { lineNumber, column: lineColumn } = position
  //       visit(ast, {
  //         enter(node, key, parent, path, ancestors) {
  //           if (node.kind === Kind.NAMED_TYPE) {
  //             const {
  //               name: { value },
  //               loc: { startToken: { line = -1, column = -1 } = {} } = {},
  //             } = node

  //             if (line === lineNumber && column <= lineColumn && lineColumn <= value.length + column) {
  //               getSchema().then(schema => {
  //                 console.log(schema, path, ancestors[2])
  //               })
  //             }
  //           }
  //         },
  //       })

  //       return {
  //         range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
  //         contents: [],
  //       }
  //     },
  //   })
  // }, [editor])

  return (
    <Panel className="query-panel" header={<Header />} headerRight={<Runner editor={editor} />}>
      <div id="query-editor"></div>
    </Panel>
  )
}
