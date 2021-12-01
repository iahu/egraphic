import { Panel, Props as PanelProps } from '@components/panel'
import React, { FC } from 'react'
import './style.css'

export interface Props extends Omit<PanelProps, 'resizable'> {
  children?: React.ReactNode
}

export const Sidebar: FC<Props> = props => {
  const { children, ...others } = props
  const onResize = () => window.dispatchEvent(new UIEvent('resize'))
  return (
    <Panel {...others} resizable={{ e: true }} className="sidebar" width="200px" header={false} onResize={onResize}>
      {children}
    </Panel>
  )
}
