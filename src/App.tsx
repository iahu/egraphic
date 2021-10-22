import { QueryView } from '@components/query-view'
import '@egret/fusion-components'
import React, { useEffect, useReducer } from 'react'
import './app.css'
import { Header } from './components/header'
import reducer, { initState } from './state'
import { AppCtx } from './state/app-ctx'

const AppCtxProvider = AppCtx.Provider

function App() {
  const [state, dispatch] = useReducer(reducer, initState)
  useEffect(() => {
    window.dispatchEvent(new UIEvent('resize'))
  }, [state.docsVisable, state.variableVisable])

  return (
    <AppCtxProvider value={{ state, dispatch }}>
      <div id="app">
        <Header />
        {state.view === 'queryView' && <QueryView />}
      </div>
    </AppCtxProvider>
  )
}

export default App
