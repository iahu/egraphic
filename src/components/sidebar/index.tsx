import { FileBrowser } from '@components/file-browser'
import { Panel, Props as PanelProps } from '@components/panel'
import { AppCtx } from '@state/app-ctx'
import { FileSet } from '@state/index'
import React, { FC, useContext } from 'react'
import './style.css'

export interface Props extends Omit<PanelProps, 'resizable' | 'onClick'> {
  onClick?: (file: FileSet) => void
}

const onResize = () => window.dispatchEvent(new UIEvent('resize'))
export const Sidebar: FC<Props> = () => {
  const {
    state: { sidebarVisable },
  } = useContext(AppCtx)

  return (
    <Panel
      hidden={!sidebarVisable}
      resizable={{ e: true }}
      header={false}
      width="260px"
      className="sidebar"
      onResize={onResize}
    >
      <FileBrowser />
    </Panel>
  )
}
