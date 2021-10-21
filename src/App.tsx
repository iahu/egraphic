import { Docs } from '@components/docs'
import { Operator } from '@components/operator'
import { Response } from '@components/response'
import '@egret/fusion-components'
import React, { useReducer } from 'react'
import './app.css'
import { Header } from './components/header'
import reducer, { initState } from './state'
import { AppCtx } from './state/app-ctx'

const AppCtxProvider = AppCtx.Provider

function App() {
  const [state, dispatch] = useReducer(reducer, initState)

  return (
    <AppCtxProvider value={{ state, dispatch }}>
      <div id="app">
        <Header />
        <div id="main">
          {state.docsVisable && <Docs />}
          <Operator />
          <Response />
        </div>
      </div>
    </AppCtxProvider>
  )
}

export default App
