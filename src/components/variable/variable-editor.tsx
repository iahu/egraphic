import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'

export const VariableEditor: FC = () => {
  const {
    state: { variable },
    dispatch,
  } = useContext(AppCtx)
  const editor = useEditor('.variable-editor', {
    language: 'json',
    value: variable,
    theme: 'egert',
  })

  useEffect(() => {
    editor?.onDidChangeModelContent(() => {
      dispatch({ type: 'variable', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  return <div className="variable-editor"></div>
}
