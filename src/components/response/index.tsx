import { Panel } from '@components/panel'
import { Status } from '@components/status'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect } from 'react'
import './index.css'

export interface Props {
  width?: string | number
}

export const Response: FC<Props> = props => {
  const { width } = props
  const { state } = useContext(AppCtx)
  const { response, responseStatus, operationName } = state
  const editor = useEditor('.response-container', {
    language: 'json',
    readOnly: true,
    lineNumbers: 'off',
  })

  useEffect(() => {
    if (editor) {
      // parseJSON(response).then(() => editor.setValue(response))
      editor.setValue(response || '"提示：发送 Graphql 请求以查看结果"')
    }
  }, [editor, response])

  return (
    <Panel
      className="response"
      name="返回结果"
      closeBtn
      maximizeBtn
      border={false}
      headerRight={
        <Status className="operation-name" status={responseStatus}>
          {!!response && operationName}
        </Status>
      }
      data-status={responseStatus}
      width={width}
    >
      <div className="response-container"></div>
    </Panel>
  )
}
