import { Docs } from '@components/docs'
import { Icon } from '@components/icon'
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
  const { docsVisable, openedFileList } = state
  const onResize = () => {
    window.dispatchEvent(new UIEvent('resize'))
  }

  if (!openedFileList?.length) {
    return (
      <div className="query-view" aria-hidden={hidden} hidden={hidden}>
        <div className="not-open-file-tips">
          <Icon id="icon-mood-happy" />
          <p>点击左侧导航栏，打开文件进行编辑</p>
        </div>
      </div>
    )
  }

  return (
    <div className="query-view" aria-hidden={hidden} hidden={hidden}>
      {docsVisable && <Docs width="30%" />}

      <PanelGroup
        className="query-editor-group"
        width={docsVisable ? '33%' : '44%'}
        height="100%"
        resizable={{ e: true }}
        onResize={onResize}
      >
        <Query />
        <Variable />
      </PanelGroup>

      <Response width={docsVisable ? '30%' : '56%'} />
    </div>
  )
})
