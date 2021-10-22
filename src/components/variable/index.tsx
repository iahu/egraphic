import { Panel } from '@components/panel'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'
import './index.css'

export const Variable: FC = () => {
  const { state, dispatch } = useContext(AppCtx)
  const editor = useEditor('.values-editor', {
    language: 'json',
    theme: 'vs-dark',
  })

  useEffect(() => {
    if (editor && !editor.getValue()) {
      editor.setValue(state.variable)
    }
  }, [editor, state.variable])

  useEffect(() => {
    editor?.onDidChangeModelContent(() => {
      dispatch({ type: 'variable', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  const handleCollapse = (collapsed: boolean) => {
    dispatch({ type: 'variableVisable', payload: !collapsed })
  }

  return (
    <Panel header="变量" thin foldable folded={!state.variableVisable} className="values" onCollapse={handleCollapse}>
      <div className="values-editor"></div>
    </Panel>
  )
}
