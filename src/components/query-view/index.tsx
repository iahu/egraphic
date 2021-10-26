import { Docs } from '@components/docs'
import { Query } from '@components/query'
import { Response } from '@components/response'
import { Variable } from '@components/variable'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext } from 'react'
import './index.css'

export interface Props {
  hidden?: boolean
}

export const QueryView: FC<Props> = React.memo(function QueryView(props: Props) {
  const { hidden = false } = props
  const { state } = useContext(AppCtx)
  return (
    <div className="query-view" aria-hidden={hidden} hidden={hidden}>
      {state.docsVisable && <Docs />}
      <div className="operator">
        <Query />
        <Variable />
      </div>
      <Response />
    </div>
  )
})
