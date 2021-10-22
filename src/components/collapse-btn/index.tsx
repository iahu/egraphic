import { Btn } from '@components/btn'
import { Icon } from '@components/icon'
import classNames from 'classnames'
import React, { FC } from 'react'

import './index.css'

export interface Props {
  className?: string
  collapsed?: boolean
  onClick?: (event: React.MouseEvent) => void
}

export const CollapseBtn: FC<Props> = props => {
  const { className, collapsed, onClick } = props
  return (
    <Btn onClick={onClick} className={classNames('collapse-btn', className)}>
      <Icon id={collapsed ? 'icon-xiangyou' : 'icon-xiangzuo'} className="collapse-icon" />
      {/*{collapsed ? '⇥' : '⇤'}*/}
    </Btn>
  )
}
