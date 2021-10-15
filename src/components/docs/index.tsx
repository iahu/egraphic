import React, { FC } from 'react'

import './index.css'

export interface Props {}

export const Docs: FC<Props> = props => {
  return (
    <div className="docs">
      <fc-panel header="Documents" closable={false}>
        Documents
      </fc-panel>
    </div>
  )
}
