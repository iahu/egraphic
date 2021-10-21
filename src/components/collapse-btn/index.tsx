import { Btn } from '@components/btn'
import classNames from 'classnames'
import React, { FC } from 'react'

export interface Props {
  className?: string
  collapsed?: boolean
  onClick?: (event: React.MouseEvent) => void
}

export const CollapseBtn: FC<Props> = props => {
  const { className, collapsed, onClick } = props
  return (
    <Btn onClick={onClick} className={classNames('collapse-btn', className)}>
      {collapsed ? '⇥' : '⇤'}
    </Btn>
  )
}
