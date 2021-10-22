import { Panel } from '@components/panel'
import { Status } from '@components/status'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'
import './index.css'

export const Response: FC = () => {
  const { state } = useContext(AppCtx)
  const { response, responseStatus, operationName } = state
  const editor = useEditor('.response-container', {
    language: 'json',
    readOnly: true,
    tabSize: 2,
    minimap: { enabled: false },
    lineNumbers: 'off',
  })

  useEffect(() => {
    if (editor) {
      // parseJSON(response).then(() => editor.setValue(response))
      editor.setValue(response)
    }
  }, [editor, response])

  return (
    <Panel
      className="response"
      header="返回结果"
      headerRight={
        <Status className="operation-name" status={responseStatus}>
          {!!response && operationName}
        </Status>
      }
      data-status={responseStatus}
    >
      <div className="response-container"></div>
    </Panel>
  )
}
