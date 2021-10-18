export const initState = {
  schemeUrl: 'http://instantgame.egret.com:4000/graphql',
  operation: 'query {\n  \n}',
  value: '{}',
}

export type State = typeof initState

export type Action =
  | { type: 'update'; payload: Partial<State> }
  | { type: 'schemeUrl'; payload: string }
  | { type: 'operation'; payload: string }
  | { type: 'value'; payload: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'schemeUrl':
      return { ...state, schemeUrl: action.payload }
    case 'operation':
      return { ...state, operation: action.payload }
    case 'value':
      return { ...state, operation: action.payload }
    case 'update':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default reducer
