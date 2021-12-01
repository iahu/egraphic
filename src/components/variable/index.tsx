import { Panel } from '@components/panel'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'
import './index.css'

export const Variable: FC = () => {
  const { state, dispatch } = useContext(AppCtx)
  const editor = useEditor('.variable-editor', {
    language: 'json',
    theme: 'egert',
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

  const onResize = () => window.dispatchEvent(new UIEvent('resize'))

  return (
    <Panel
      name="变量"
      width="auto"
      height="200px"
      minimize={!state.variableVisable}
      className="variable"
      closeBtn
      minimizeBtn
      onMinimize={handleCollapse}
      // header={false}
      resizable={{ n: true, originY: 'bottom' }}
      onResize={onResize}
    >
      <div className="variable-editor"></div>
    </Panel>
  )
}
