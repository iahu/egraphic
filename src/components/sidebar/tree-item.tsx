import { ContextMenu } from '@components/context-menu'
import { Icon } from '@components/icon'
import { FCTreeItem } from '@egret/fusion-components'
import { createFile, createFolder } from '@helper'
import { AppCtx } from '@state/app-ctx'
import { FileSet, FileSetList } from '@state/index'
import classNames from 'classnames'
import React, { FC, useContext, useRef, useState } from 'react'
import { ItemEditor } from './item-editor'

export interface Props {
  slot?: string
  onClick?: (file: FileSet) => void
  dataSource: FileSet
}

const filterFileList = (fileSetList: FileSetList, id: string): FileSetList => {
  return fileSetList.filter(file => {
    if (file.type === 'folder' && file.fileList?.length) {
      file.fileList = filterFileList(file.fileList, id)
    }
    return file.id !== id
  })
}

export const TreeItem: FC<Props> = props => {
  const {
    dispatch,
    state: { fileList },
  } = useContext(AppCtx)
  const itemRef = useRef<FCTreeItem>(null)
  const { dataSource, slot } = props
  const isFolder = dataSource.type === 'folder'
  const [status, setStatus] = useState('')
  const handleOk = (name: string) => {
    if (status === 'createFile' && dataSource.type === 'folder') {
      dataSource.fileList = dataSource.fileList ?? []
      dataSource.fileList.push(createFile(name))
      if (itemRef.current) {
        itemRef.current.setAttribute('haschild', 'true')
        itemRef.current.expanded = true
      }
    } else if (status === 'createFolder' && dataSource.type === 'folder') {
      dataSource.fileList = dataSource.fileList ?? []
      dataSource.fileList.push(createFolder(name))
      if (itemRef.current) {
        itemRef.current.setAttribute('haschild', 'true')
        itemRef.current.expanded = true
      }
    } else if (status === 'rename') {
      dataSource.name = name
    }
    dispatch({ type: 'fileList', payload: [...fileList] })
    setStatus('')
  }

  const handleClick = (type: string) => {
    switch (type) {
      case 'createFile':
      case 'createFolder':
      case 'rename':
        setStatus(type)
        break
      case 'delete':
        dispatch({ type: 'fileList', payload: filterFileList(fileList, dataSource.id) })
        break
    }
  }
  const disabled = dataSource.type === 'file' ? ['folder'] : undefined

  return (
    <ContextMenu onClick={handleClick} disabled={disabled}>
      <fc-tree-item
        ref={itemRef}
        role="treeitem"
        slot={slot}
        class={classNames('sidebar-tree-item', { 'item-editor': status === 'rename' })}
        selectable={dataSource.type === 'file'}
        expandable
      >
        {status === 'rename' ? (
          <ItemEditor defaultName={dataSource.name} type={dataSource.type} onOk={handleOk} />
        ) : (
          <div className="sidebar-item">
            <Icon id={isFolder ? 'icon-folder-graphql' : 'icon-graphql'} className="sidebar-file-type-icon" size={14} />
            <span>{dataSource.name}</span>
            {/*
            <span className="sidebar-actions">
              {dataSource.type === 'folder' && (
                <IconBtn id="icon-add" className="sidebar-icon-add" onClick={handleAdd} />
              )}
              <IconBtn id="icon-trash" className="sidebar-icon-delete" onClick={() => handleDelete(dataSource.id)} />
              <IconBtn id="icon-rename" className="sidebar-icon-rename" onClick={handleRename} />
            </span>
            */}
          </div>
        )}

        {isFolder ? dataSource.fileList?.map(item => <TreeItem key={item.id} dataSource={item} slot="item" />) : null}
        {status === 'createFile' && (
          <fc-tree-item className="sidebar-tree-item item-editor" role="treeitem" slot="item">
            <ItemEditor type="file" onOk={handleOk} />
          </fc-tree-item>
        )}
        {status === 'createFolder' && (
          <fc-tree-item className="sidebar-tree-item item-editor" role="treeitem" slot="item">
            <ItemEditor type="folder" onOk={handleOk} />
          </fc-tree-item>
        )}
      </fc-tree-item>
    </ContextMenu>
  )
}
