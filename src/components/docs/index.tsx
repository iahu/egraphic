import React, { FC } from 'react'

import './index.css'

export interface Props {}

export const Docs: FC<Props> = props => {
  return (
    <div className="docs">
      <fc-panel header="文档" closable={false}>
        文档
      </fc-panel>
    </div>
  )
}
