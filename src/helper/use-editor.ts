import { AppCtx } from '@state/app-ctx'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import 'monaco-editor/monaco.d'
import prettier from 'prettier/standalone'
import babelPlugins from 'prettier/parser-babel'
import graphqlPlugins from 'prettier/parser-graphql'
import { LANGUAGE_ID } from 'monaco-graphql'
import GraphQLWorker from 'monaco-graphql/esm/graphql.worker?worker'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

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

monaco.editor.defineTheme('egert', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {},
})

const registerJSONFormatProvider = () => {
  monaco.languages.registerDocumentFormattingEditProvider('json', {
    provideDocumentFormattingEdits(model, options) {
      const text = model.getValue()
      const { tabSize, insertSpaces } = options
      const formatted = prettier.format(text, {
        parser: 'json',
        plugins: [babelPlugins],
        tabWidth: tabSize,
        useTabs: !insertSpaces,
      })
      return [{ range: model.getFullModelRange(), text: formatted }]
    },
  })
}

const registerGraphQLFormatProvider = () => {
  monaco.languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, {
    provideDocumentFormattingEdits(model, options) {
      const text = model.getValue()
      const { tabSize, insertSpaces } = options
      const formatted = prettier.format(text, {
        parser: 'graphql',
        plugins: [graphqlPlugins],
        tabWidth: tabSize,
        useTabs: !insertSpaces,
      })
      return [{ range: model.getFullModelRange(), text: formatted }]
    },
  })
}

monaco.languages.onLanguage('json', registerJSONFormatProvider)
monaco.languages.onLanguage(LANGUAGE_ID, registerGraphQLFormatProvider)

/**
 * monaco eidtor 的 hook
 * 注意：monaco 并不支持在一个页面上的多个编辑器使用不同的主题
 * @type monaco.editor.IStandaloneCodeEditor
 */
export const useEditor = (container: string, config?: monaco.editor.IStandaloneEditorConstructionOptions) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
  const { state } = useContext(AppCtx)
  const { formatOnBlur, tabSize, view } = state
  const { value = '' } = config || {}
  const positionRef = useRef<monaco.IPosition | null>(null)
  const setPosition = useCallback(
    (position = positionRef.current) => position && editor?.setPosition(position),
    [editor],
  )

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
      theme: 'egert',
      tabSize,
      parameterHints: { enabled: true, cycle: true },
      trimAutoWhitespace: true,
      lineDecorationsWidth: 1,
      renderLineHighlight: 'none',
      lineNumbersMinChars: 4,
      scrollBeyondLastColumn: 0,
      scrollBeyondLastLine: false,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      minimap: { enabled: false },
      ...config,
    })

    setEditor(editor)
    setPosition()

    const handleResize = () => editor.layout()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      positionRef.current = editor.getPosition()
      editor.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, tabSize])

  useEffect(() => {
    /**
     * 因为设置 value 会导致光标位置重置到文档开头
     * 所以只接收初始值，后面的值由 monaco 自己维护
     * 如果有更新的需要，可以在外部通过 `setValue` 更新
     */
    if (editor && !editor.hasTextFocus()) {
      editor.setValue(value)
      setPosition()
    }
  }, [editor, value, setPosition])

  useEffect(() => {
    if (formatOnBlur && editor && tabSize >= 0) {
      editor.updateOptions({ tabSize })
      editor.getAction('editor.action.formatDocument')?.run()
    }
  }, [editor, tabSize, formatOnBlur])

  useEffect(() => {
    if (!editor) return
    editor.onDidChangeModelLanguageConfiguration(() => {
      const languageId = editor.getModel()?.getModeId()
      if (languageId === 'json') {
        registerJSONFormatProvider()
      } else if (languageId === LANGUAGE_ID) {
        registerGraphQLFormatProvider()
      }
    })
    editor.onDidBlurEditorWidget(() => {
      // 自动格式化
      if (formatOnBlur) {
        editor.getAction('editor.action.formatDocument')?.run()
      }
    })
  }, [editor, formatOnBlur])

  useEffect(() => {
    // 强刷 layout
    editor?.layout()
  }, [editor, view])

  useEffect(() => {
    editor?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      console.log('fake save success!')
      window.dispatchEvent(new CustomEvent('save'))
    })
  }, [editor])

  return editor
}
