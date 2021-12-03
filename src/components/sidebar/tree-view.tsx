import { FileSetList, FileSet } from '@state/index'
import React, { FC } from 'react'
import { TreeItem } from './tree-item'

export interface Props {
  onClick?: (file: FileSet) => void
  dataSource: FileSetList
}

export const TreeView: FC<Props> = props => {
  const { dataSource } = props

  return (
    <>
      {dataSource.map((file, idx) => (
        <TreeItem dataSource={file} key={idx}></TreeItem>
      ))}
    </>
  )
}
