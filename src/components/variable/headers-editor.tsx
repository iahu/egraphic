import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'

export const HeadersEditor: FC = () => {
  const {
    state: { headers },
    dispatch,
  } = useContext(AppCtx)
  const editor = useEditor('.variable-editor', {
    language: 'json',
    value: headers,
    theme: 'egert',
  })

  useEffect(() => {
    editor?.onDidChangeModelContent(() => {
      dispatch({ type: 'headers', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  return <div className="variable-editor"></div>
}
