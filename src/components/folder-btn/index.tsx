import { Btn } from '@components/btn'
import classNames from 'classnames'
import React, { FC } from 'react'

export interface Props {
  className?: string
  collapsed?: boolean
  onClick?: (event: React.MouseEvent) => void
}

export const FolderBtn: FC<Props> = props => {
  const { className, collapsed, onClick } = props
  return (
    <Btn className={classNames('folder-btn', className, { collapsed })} onClick={onClick}>
      {collapsed ? '+' : '-'}
    </Btn>
  )
}
