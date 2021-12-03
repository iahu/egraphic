import classNames from 'classnames'
import React, { FC } from 'react'
import './index.css'

export interface Props {
  className?: string
  disabled?: boolean
  title?: string
  ghost?: boolean
  onClick?: (event: React.MouseEvent) => void
  slot?: string
  [key: `data-${string}`]: string | number
}

export const Btn: FC<Props> = props => {
  const { className, disabled, title, ghost, children, onClick, ...others } = props
  return (
    <button
      {...others}
      title={title}
      className={classNames('btn', className, { ghost })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
