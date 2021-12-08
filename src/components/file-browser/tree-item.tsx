import { ContextMenu } from '@components/context-menu'
import { Icon } from '@components/icon'
import { IconBtn } from '@components/icon-btn'
import { FCTreeItem } from '@egret/fusion-components'
import { createFile, createFolder, filterFileList } from '@helper'
import { AppCtx } from '@state/app-ctx'
import { FileSet } from '@state/index'
import classNames from 'classnames'
import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { ItemEditor } from './item-editor'

export interface Props {
  slot?: string
  defaultStatus?: string
  onClick?: (file: FileSet) => void
  dataSource: FileSet
}

export const TreeItem: FC<Props> = props => {
  const {
    dispatch,
    state: { fileList, openedFileList },
  } = useContext(AppCtx)

  const itemRef = useRef<FCTreeItem>(null)
  const {
    dataSource,
    dataSource: { id },
    slot,
    defaultStatus = '',
    onClick,
  } = props
  const isFolder = dataSource.type === 'folder'
  const [status, setStatus] = useState('')
  useEffect(() => {
    setStatus(defaultStatus)
  }, [defaultStatus])
  const handleOk = (name: string) => {
    if (!name) {
      return setStatus('')
    }
    if (status === 'createFile' && dataSource.type === 'folder') {
      dataSource.fileList = fileList ?? []
      fileList.push(createFile(name))
    } else if (status === 'createFolder' && dataSource.type === 'folder') {
      dataSource.fileList = fileList ?? []
      fileList.push(createFolder(name))
    } else if (status === 'rename') {
      dataSource.name = name
    }
    dispatch({ type: 'fileList', payload: [...fileList] })
    setStatus('')
  }

  const handleClickMenu = (type: string) => {
    switch (type) {
      case 'createFile':
      case 'createFolder':
        setStatus(type)
        if (itemRef.current) {
          itemRef.current.setAttribute('haschild', 'true')
          itemRef.current.expanded = true
        }
        break
      case 'rename':
        setStatus(type)
        break
      case 'delete':
        dispatch({ type: 'fileList', payload: filterFileList(fileList, id) })
        break
    }
  }
  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault()
    setStatus('rename')
  }
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'fileList', payload: filterFileList(fileList, id) })
  }
  const [expaneded, setExpanded] = useState(true)
  const handleClickItem = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dataSource.type === 'folder' && itemRef.current) {
      setExpanded(itemRef.current.expanded)
    }

    if (dataSource.type === 'file') {
      dispatch({ type: 'swapFile', payload: dataSource })
    }
    onClick?.(dataSource)
  }
  const disabled = dataSource.type === 'file' ? ['createFolder'] : undefined

  return (
    <ContextMenu onClick={handleClickMenu} disabled={disabled}>
      <fc-tree-item
        ref={itemRef}
        role="treeitem"
        slot={slot}
        class={classNames('file-browser-tree-item', { 'item-editor': status === 'rename' })}
        selectable={dataSource.type === 'file'}
        expanded={expaneded}
        selected={!!openedFileList.find(f => f.id === id)}
        expandable
      >
        {status === 'rename' ? (
          <ItemEditor defaultName={dataSource.name} type={dataSource.type} onOk={handleOk} />
        ) : (
          <div className="file-browser-item" onClick={handleClickItem}>
            <Icon
              id={isFolder ? (expaneded ? 'icon-folder-graphql-open' : 'icon-folder-graphql') : 'icon-graphql'}
              className="file-browser-file-type-icon"
              size={14}
            />
            <span>{dataSource.name}</span>
            <span className="file-browser-actions">
              <IconBtn id="icon-rename" className="file-browser-icon-rename" onClickCapture={handleRename} />
              <IconBtn id="icon-trash" className="file-browser-icon-delete" onClickCapture={handleDelete} />
            </span>
          </div>
        )}

        {isFolder &&
          dataSource.fileList?.map(item => <TreeItem onClick={onClick} key={item.id} dataSource={item} slot="item" />)}

        {(status === 'createFile' || status === 'createFolder') && (
          <fc-tree-item class="file-browser-tree-item item-editor" role="treeitem" slot="item" selectable={false}>
            <ItemEditor type={status === 'createFile' ? 'file' : 'folder'} onOk={handleOk} />
          </fc-tree-item>
        )}
      </fc-tree-item>
    </ContextMenu>
  )
}
