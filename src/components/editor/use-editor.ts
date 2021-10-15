import { State } from '@state/index'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import 'monaco-editor/monaco.d'
import { api as GraphQLAPI, LANGUAGE_ID } from 'monaco-graphql'
// import GraphQLWorker from 'monaco-graphql/esm/graphql.worker?worker'
import GraphQLWorker from './graphql.worker?worker'
import { useEffect } from 'react'

const setup = () => {
  window.MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
      if (label === LANGUAGE_ID) {
        return new GraphQLWorker()
      }
      if (label === 'json') {
        return new JSONWorker()
      }
      return new EditorWorker()
    },
  }
}

export const useEditor = (
  config: Pick<State, 'operation' | 'gqOrigin'> & { container: string },
  cb?: (editor: monaco.editor.IStandaloneCodeEditor) => void,
) => {
  const { operation, gqOrigin, container } = config
  useEffect(() => {
    setup()

    const editor = monaco.editor.create(document.getElementById(container) as HTMLDivElement, {
      value: operation,
      language: LANGUAGE_ID,
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true,
      folding: true,
      theme: 'vs-dark',
      minimap: { enabled: false },
    })

    setConfig(editor, gqOrigin)

    cb?.(editor)

    return () => editor.dispose()
  }, [operation, gqOrigin, cb])
}

export const setConfig = (editor: monaco.editor.IStandaloneCodeEditor, gqOrigin: string) => {
  editor.getModel()?.updateOptions({
    tabSize: 2,
    indentSize: 2,
    trimAutoWhitespace: true,
  })

  GraphQLAPI.setModeConfiguration({
    documentFormattingEdits: true,
    completionItems: true,
    hovers: true,
    documentSymbols: true,
    diagnostics: true,
  })
  GraphQLAPI.setFormattingOptions({
    prettierConfig: { tabWidth: 2, useTabs: true, printWidth: 120 },
  })

  GraphQLAPI.setSchemaUri(`${gqOrigin}/graphql`)
}
