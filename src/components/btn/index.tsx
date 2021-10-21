import classNames from 'classnames'
import React, { FC } from 'react'
import './index.css'

export interface Props {
  className?: string
  disabled?: boolean
  title?: string
  onClick?: (event: React.MouseEvent) => void
}

export const Btn: FC<Props> = props => {
  const { className, disabled, title, children, onClick } = props
  return (
    <button title={title} className={classNames('btn', className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
