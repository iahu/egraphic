import { replacer } from '@helper/stringify'
import React from 'react'

export interface Props {
  dataSource: string
}

export const RawView = React.memo<Props>(function RawView(props) {
  const { dataSource } = props
  return (
    <div className="response-container raw-view">
      <pre>{JSON.stringify(JSON.parse(dataSource), (k, v) => replacer(v), 0)}</pre>
    </div>
  )
})
