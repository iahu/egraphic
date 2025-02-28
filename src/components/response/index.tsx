import { Panel } from '@components/panel'
import { FCSelect } from '@i18u/fusion-components'
import { replacer } from '@helper/stringify'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useState } from 'react'
import './index.css'
import { JSONView } from './json-view'
import { RawView } from './raw-view'
import { TableView } from './table-view'

export interface Props {
  width?: string | number
}

const views = [
  { name: 'JSON', id: 'json', icon: 'icon-json' },
  { name: 'Table', id: 'table', icon: 'icon-grid' },
  { name: 'Raw', id: 'raw', icon: 'icon-grid' },
]

export const Response: FC<Props> = props => {
  const { width } = props
  const [view, setView] = useState('json')
  const { state } = useContext(AppCtx)
  const { response, responseStatus } = state
  const handleChange = (e: React.FormEvent<FCSelect>) => {
    const { target } = e
    if (target instanceof FCSelect) {
      setView(target.value)
    }
  }
  const handleResize = () => window.dispatchEvent(new UIEvent('resize'))

  return (
    <Panel
      className="response"
      name="返回结果"
      onResize={handleResize}
      closeBtn
      maximizeBtn
      border={false}
      headerRight={
        <fc-select class="view-select" value={view} onChange={handleChange}>
          {views.map(v => (
            <fc-list-option key={v.id} value={v.id}>
              {v.name}
            </fc-list-option>
          ))}
        </fc-select>
      }
      data-status={responseStatus}
      width={width}
    >
      {view === 'json' && <JSONView dataSource={response} />}
      {view === 'table' && <TableView dataSource={response} />}
      {view === 'raw' && <RawView dataSource={response} />}
    </Panel>
  )
}
