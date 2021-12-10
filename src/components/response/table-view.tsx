import { isObject } from '@helper'
import React from 'react'
import { ArrayToTable } from './array-to-table'
import { ObjToTable } from './obj-to-table'

export interface Props {
  dataSource: string
}

export const TableView = React.memo<Props>(function TableView(props) {
  const { dataSource } = props
  const data = JSON.parse(dataSource.trim())

  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.nativeEvent.target as HTMLElement
    const relatedTarget = e.nativeEvent.relatedTarget as HTMLElement
    if (target.tagName.toLowerCase() === 'td') {
      target.classList.toggle('hover', e.type === 'mouseover')
    }
    if (relatedTarget) {
      relatedTarget.classList.toggle('hover', e.type === 'mouseleave')
    }
  }

  return (
    <div className="response-container table-view" onMouseOver={handleMouseOver} onMouseLeave={handleMouseOver}>
      {Array.isArray(data) ? (
        <ArrayToTable dataSource={data} />
      ) : isObject(data) ? (
        <ObjToTable dataSource={data} />
      ) : (
        dataSource
      )}
    </div>
  )
})
