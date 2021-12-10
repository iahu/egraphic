import { useEditor } from '@helper/use-editor'
import React, { FC, useEffect } from 'react'

export interface Props {
  dataSource: string
}

export const JSONView: FC<Props> = props => {
  const { dataSource } = props
  const editor = useEditor('.json-view', {
    language: 'json',
    readOnly: true,
    lineNumbers: 'off',
  })

  useEffect(() => {
    if (editor) {
      // parseJSON(response).then(() => editor.setValue(response))
      editor.setValue(dataSource || '"提示：发送 Graphql 请求以查看结果"')
    }
  }, [editor, dataSource])

  return <div className="response-container json-view"></div>
}
