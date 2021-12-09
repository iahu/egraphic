import classNames from 'classnames'
import React, { FC } from 'react'
import './index.css'

export interface Props {
  className?: string
  disabled?: boolean
  selected?: boolean
  title?: string
  ghost?: boolean
  onClick?: (event: React.MouseEvent) => void
  onClickCapture?: (event: React.MouseEvent) => void
  slot?: string
  readOnly?: boolean
  [key: `data-${string}`]: string | number
}

export const Btn: FC<Props> = props => {
  const { className, disabled, title, ghost, children, onClick, selected, ...others } = props
  return (
    <button
      {...others}
      title={title}
      className={classNames('btn', className, { ghost, selected })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
