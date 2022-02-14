import { useEditor } from '@helper/use-editor'
import React, { useEffect } from 'react'

export interface Props {
  dataSource: string
}

export const JSONView = React.memo<Props>(function JSONView(props) {
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
    const onResize = () => editor?.layout()

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [editor, dataSource])

  return <div className="response-container json-view"></div>
})
