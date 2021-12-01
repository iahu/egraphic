import classNames from 'classnames'
import React, { FC } from 'react'
import { Panel, Props as PanelProps } from '../panel'

import './style.css'

export interface Props extends PanelProps {
  className?: string
  direction?: 'vertical' | 'horizontal'
  children?: React.ReactNode
}

export const PanelGroup: FC<Props> = props => {
  const { className, direction = 'vertical', children, header = false, border = false, ...others } = props

  return (
    <Panel
      {...others}
      header={header}
      border={border}
      className={classNames('panel-group', className, { vertical: direction === 'vertical' })}
    >
      {children}
    </Panel>
  )
}
