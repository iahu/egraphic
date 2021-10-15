import React from 'react'
import { Action, initState, State } from '.'

type AppCtx = {
  state: State
  dispatch: React.Dispatch<Action>
}

export const AppCtx = React.createContext<AppCtx>({ state: initState } as AppCtx)
