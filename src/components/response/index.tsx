import React, { FC } from 'react'

import './index.css'

export interface Props {}

export const Response: FC<Props> = props => {
  return (
    <div className="response">
      <fc-panel header="返回值" closable={false}>
        返回值
      </fc-panel>
    </div>
  )
}
