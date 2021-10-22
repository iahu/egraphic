import { Status as ResponseStatus } from '@state/index'
import classNames from 'classnames'
import React, { FC } from 'react'

import './index.css'

export interface Props {
  className?: string
  name?: React.ReactNode
  status: ResponseStatus
}

export const Status: FC<Props> = ({ className, children, name = children, status }) => {
  return <div className={classNames('status', status, className)}>{name}</div>
}
