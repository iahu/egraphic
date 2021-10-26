import React, { FC } from 'react'
import 'http://at.alicdn.com/t/font_2883781_638319wxmo.js'
import './index.css'
import classNames from 'classnames'

export interface Props {
  id: string
  className?: string
  size?: number
}

export const Icon: FC<Props> = ({ className, id, size }) => {
  const style = size ? ({ '--icon-size': `${size}px` } as React.CSSProperties) : undefined
  return (
    <svg className={classNames('icon', className)} aria-hidden="true" style={style}>
      <use xlinkHref={`#${id}`}></use>
    </svg>
  )
}
