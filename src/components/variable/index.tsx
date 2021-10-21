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
    if (editor && state.variableVisable) {
      editor.layout()
    }
  }, [editor, state.variableVisable])

  useEffect(() => {
    if (editor && !editor.getValue()) {
      editor.setValue(state.variableValues)
    }
  }, [editor, state.variableValues])

  useEffect(() => {
    editor?.onDidChangeModelContent(() => {
      dispatch({ type: 'variableValues', payload: editor.getValue() })
    })
  }, [editor, dispatch])

  const handleCollapse = (collapsed: boolean) => {
    dispatch({ type: 'variableVisable', payload: !collapsed })
  }

  return (
    <Panel header="参数" thin foldable folded={!state.variableVisable} className="values" onCollapse={handleCollapse}>
      <div className="values-editor"></div>
    </Panel>
  )
}
