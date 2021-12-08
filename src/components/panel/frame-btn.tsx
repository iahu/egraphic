import { IconBtn, Props } from '@components/icon-btn'
import classNames from 'classnames'
import React, { FC } from 'react'

export const FrameBtn: FC<Props> = props => {
  const { className, id, onClick, circle = true, ghost = false, ...others } = props
  return (
    <IconBtn
      circle={circle}
      ghost={ghost}
      className={classNames('frame-btn', className)}
      id={id}
      onClick={onClick}
      {...others}
    />
  )
}
