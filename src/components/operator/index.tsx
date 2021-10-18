import React, { FC } from 'react'
import { Editor } from '../editor'

import './index.css'

export interface Props {}

export const Operator: FC<Props> = props => {
  return (
    <div className="operator">
      <fc-panel header="操作台" closable={false}>
        <Editor />
      </fc-panel>
    </div>
  )
}
