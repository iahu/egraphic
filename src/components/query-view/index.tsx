import { Docs } from '@components/docs'
import { Operator } from '@components/operator'
import { Response } from '@components/response'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext } from 'react'

import './index.css'

export const QueryView: FC = React.memo(function QueryView() {
  const { state } = useContext(AppCtx)
  return (
    <div className="query-view">
      {state.docsVisable && <Docs />}
      <Operator />
      <Response />
    </div>
  )
})
