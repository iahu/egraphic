import { Docs } from '@components/docs'
import { FileBrowser } from '@components/file-browser'
import { Icon } from '@components/icon'
import { PanelGroup } from '@components/panel-group'
import { Query } from '@components/query'
import { Response } from '@components/response'
import { StatusBar } from '@components/status-bar'
import { Variable } from '@components/variable'
import '@i18u/fusion-components'
import React, { useEffect, useReducer } from 'react'
import './app.css'
import { fireResizeEvent } from './helper'
import reducer, { initState } from './state'
import { AppCtx } from './state/app-ctx'

const AppCtxProvider = AppCtx.Provider

function App() {
  const [state, dispatch] = useReducer(reducer, initState)
  const { sidebarVisable, docsVisable, openedFileList } = state
  const onResize = () => fireResizeEvent()
  let offset = 0
  if (sidebarVisable) offset += 240
  if (docsVisable) offset += 360

  useEffect(() => {
    onResize()
  }, [state.docsVisable, state.variableVisable])

  return (
    <AppCtxProvider value={{ state, dispatch }}>
      <div id="app">
        <div className="main">
          <FileBrowser width="240px" />

          {!openedFileList?.length ? (
            <div className="not-open-file-tips">
              <Icon id="icon-mood-happy" />
              <p>点击左侧导航栏，打开文件进行编辑</p>
            </div>
          ) : (
            <>
              {docsVisable && <Docs width="360px" />}
              <PanelGroup
                className="query-editor-group"
                width={`calc((100% - ${offset}px) * 0.46)`}
                height="100%"
                resizable={{ e: true }}
                onResize={onResize}
              >
                <Query />
                <Variable />
              </PanelGroup>

              <Response width={`calc((100% - ${offset}px) * 0.54)`} />
            </>
          )}
        </div>
        <StatusBar />
      </div>
    </AppCtxProvider>
  )
}

export default App
