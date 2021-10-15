export const initState = {
  gqOrigin: 'http://10.0.2.151:7000/graphql',
  operation: 'query {}',
  value: '{}',
}

export type State = typeof initState

export type Action =
  | { type: 'update'; payload: Partial<State> }
  | { type: 'gqOrigin'; payload: string }
  | { type: 'operation'; payload: string }
  | { type: 'value'; payload: string }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'gqOrigin':
      return { ...state, gqOrigin: action.payload }
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
