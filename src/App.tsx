import { QueryView } from '@components/query-view'
import { SettingView } from '@components/setting-view'
import '@egret/fusion-components'
import React, { useEffect, useReducer } from 'react'
import './app.css'
import { Header } from './components/header'
import reducer, { initState } from './state'
import { AppCtx } from './state/app-ctx'

const AppCtxProvider = AppCtx.Provider

function App() {
  const [state, dispatch] = useReducer(reducer, initState)
  const { view } = state
  useEffect(() => {
    window.dispatchEvent(new UIEvent('resize'))
  }, [state.docsVisable, state.variableVisable])

  return (
    <AppCtxProvider value={{ state, dispatch }}>
      <div id="app">
        <Header />
        <QueryView hidden={view !== 'queryView'} />
        {view === 'settingView' && <SettingView />}
      </div>
    </AppCtxProvider>
  )
}

export default App
