import { IconBtn } from '@components/icon-btn'
import { Panel, Props as PanelProps } from '@components/panel'
import { createFile, createFolder, fireResizeEvent } from '@helper/index'
import { AppCtx } from '@state/app-ctx'
import { FileSet } from '@state/index'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ItemEditor } from './item-editor'
import './style.css'
import { TreeItem } from './tree-item'

const isCreateType = (type: string): type is FileSet['type'] => {
  return ['file', 'folder'].includes(type)
}

export interface Props extends Omit<PanelProps, 'onClick'> {
  onClick?: (file: FileSet) => void
}

export const FileBrowser: FC<Props> = props => {
  const { width, onClick, ...others } = props
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
  const handleClickItem = (file: FileSet) => {
    const url = new URL(location.href)
    url.searchParams.set('file', file.id)
    history.pushState(file, file.name, url)
    onClick?.(file)
  }

  useEffect(() => {
    window.dispatchEvent(new UIEvent('resize'))
  }, [sidebarVisable])

  return (
    <Panel
      width={width}
      resizable={{ e: true }}
      onResize={fireResizeEvent}
      {...others}
      className="file-browser"
      name={
        <div className="action-bar">
          <IconBtn data-type="file" id="icon-file" title="Create New Query" onClickCapture={handleClickCreatBtn} />
          <IconBtn
            data-type="folder"
            id="icon-folder"
            title="Create Query Folder"
            onClickCapture={handleClickCreatBtn}
          />
        </div>
      }
      hidden={!sidebarVisable}
    >
      <fc-tree-view>
        {fileList.map((file, idx) => (
          <TreeItem dataSource={file} key={idx} onClick={handleClickItem}></TreeItem>
        ))}
        {isCreateType(createType) && (
          <fc-tree-item class="item-editor" selected selectable={false}>
            <ItemEditor type={createType} onOk={handleOk} />
          </fc-tree-item>
        )}
      </fc-tree-view>
    </Panel>
  )
}
