import { Panel } from '@components/panel'
import { parseJSON } from '@components/runner/helper'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'
import './index.css'

export const Response: FC = () => {
  const { state } = useContext(AppCtx)
  const editor = useEditor('.response-container', {
    language: 'json',
    readOnly: true,
    tabSize: 2,
    minimap: { enabled: false },
    lineNumbers: 'off',
  })

  useEffect(() => {
    if (editor) {
      parseJSON(state.response).then(() => editor.setValue(state.response))
    }
  }, [editor, state.response])

  return (
    <div className="response">
      <Panel header="返回">
        <div className="response-container"></div>
      </Panel>
    </div>
  )
}
