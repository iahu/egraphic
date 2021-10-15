import React, { FC } from 'react'

import './index.css'

export interface Props {}

export const Response: FC<Props> = props => {
  return (
    <div className="response">
      <fc-panel header="Response" closable={false}>
        Response
      </fc-panel>
    </div>
  )
}
