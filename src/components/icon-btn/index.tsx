import { Btn, Props as BtnProps } from '@components/btn'
import { Icon, Props as IconProps } from '@components/icon'
import classNames from 'classnames'
import React, { FC } from 'react'
import './index.css'

export interface Props extends BtnProps, IconProps {
  circle?: boolean
  border?: boolean
}

export const IconBtn: FC<Props> = props => {
  const { className, id, size = 12, circle, border, title, ghost = true, disabled, onClick } = props
  return (
    <Btn
      className={classNames('icon-btn', className, { circle, border })}
      title={title}
      ghost={ghost}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon id={id} size={size} />
    </Btn>
  )
}
