import { IconBtn } from '@components/icon-btn'
import { Panel, Props as PanelProps } from '@components/panel'
import { createFile, createFolder, uuid } from '@helper/index'
import { AppCtx } from '@state/app-ctx'
import { FileSet } from '@state/index'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ItemEditor } from './item-editor'
import './style.css'
import { TreeView } from './tree-view'

const isFileType = (type: string): type is FileSet['type'] => {
  return ['file', 'folder'].includes(type)
}

export interface Props extends Omit<PanelProps, 'resizable' | 'onClick'> {
  onClick?: (file: FileSet) => void
}

export const Sidebar: FC<Props> = () => {
  const {
    dispatch,
    state: { fileList, sidebarVisable },
  } = useContext(AppCtx)
  const [createType, setCreateType] = useState('')
  const handleClickCreatBtn = (e: React.MouseEvent) => {
    e.preventDefault()
    const { type } = (e.currentTarget as HTMLElement).dataset
    if (type) {
      setCreateType(type)
    }
  }
  const onResize = () => window.dispatchEvent(new UIEvent('resize'))
  const handleOk = (name: string, type?: string) => {
    if (type === 'file') {
      dispatch({
        type: 'fileList',
        payload: [...fileList, createFile(name)],
      })
      setCreateType('')
    } else if (type === 'folder') {
      dispatch({
        type: 'fileList',
        payload: [...fileList, createFolder(name)],
      })
      setCreateType('')
    }
  }

  useEffect(() => {
    window.dispatchEvent(new UIEvent('resize'))
  }, [sidebarVisable])

  return (
    <Panel
      resizable={{ e: true }}
      className="sidebar"
      width="260px"
      name={
        <div className="action-bar">
          <IconBtn data-type="file" id="icon-file" title="Create New Query" onClick={handleClickCreatBtn} />
          <IconBtn data-type="folder" id="icon-folder" title="Create Query Folder" onClick={handleClickCreatBtn} />
        </div>
      }
      headerRight={<IconBtn id="icon-book" className="icon-document" title="View Documents" />}
      onResize={onResize}
      hidden={!sidebarVisable}
    >
      <fc-tree-view>
        <TreeView dataSource={fileList} />
        {isFileType(createType) && (
          <fc-tree-item class="item-editor" selected selectable={false}>
            <ItemEditor type={createType} onOk={handleOk} />
          </fc-tree-item>
        )}
      </fc-tree-view>
    </Panel>
  )
}
