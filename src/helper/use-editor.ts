import { AppCtx } from '@state/app-ctx'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import 'monaco-editor/monaco.d'
import { LANGUAGE_ID } from 'monaco-graphql'
import GraphQLWorker from 'monaco-graphql/esm/graphql.worker?worker'
import { useContext, useEffect, useState } from 'react'

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

export const useEditor = (container: string, config?: monaco.editor.IStandaloneEditorConstructionOptions) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
  const { state } = useContext(AppCtx)
  const { 'format:formatOnBlur': formatOnBlur, 'format:tabSize': tabSize } = state
  const { value = '' } = config || {}

  /**
   * 这里希望一个页面中只创建一个 editor 实例，因为
   * 1. 节省内存
   * 2. monaco 没有提供解绑事件的方法，rerender 后无法解绑之前的事件
   */
  useEffect(() => {
    const $container = document.querySelector(container) as HTMLDivElement
    if (!$container) {
      console.warn('未找到元素: %s', container)
      return
    }

    const editor = monaco.editor.create($container, {
      language: 'json',
      formatOnPaste: true,
      formatOnType: true,
      folding: true,
      theme: 'vs-dark',
      tabSize: 2,
      parameterHints: { enabled: true, cycle: true },
      trimAutoWhitespace: true,
      lineDecorationsWidth: 0,
      minimap: { enabled: false },
      ...config,
    })
    setEditor(editor)

    const handleResize = () => editor.layout()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      editor.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container])

  useEffect(() => {
    /**
     * 因为设置 value 会导致光标位置重置到文档开头
     * 所以只接收初始值，后面的值由 monaco 自己维护
     * 如果有更新的需要，可以在外部通过 `setValue` 更新
     */
    if (!editor?.getValue()) {
      editor?.setValue(value)
    }
  }, [editor, value])

  useEffect(() => {
    editor?.updateOptions({ tabSize })
  }, [editor, tabSize])

  useEffect(() => {
    if (editor && formatOnBlur) {
      editor.onDidBlurEditorText(() => {
        editor.getAction('editor.action.formatDocument').run()
      })
    }
  }, [editor, formatOnBlur])

  return editor
}
