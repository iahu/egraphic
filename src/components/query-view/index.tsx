import { Docs } from '@components/docs'
import { PanelGroup } from '@components/panel-group'
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
  const onResize = () => {
    window.dispatchEvent(new UIEvent('resize'))
  }

  return (
    <div className="query-view" aria-hidden={hidden} hidden={hidden}>
      {state.docsVisable && <Docs />}

      <PanelGroup className="query-editor-group" width="44%" height="100%" resizable={{ e: true }} onResize={onResize}>
        <Query />
        <Variable />
      </PanelGroup>
      <Response />
    </div>
  )
})
