import { getItem, setItem } from '@helper/use-storage'

export const initState = {
  schemeUrl: getItem('editor:schemeUrl', 'http://instantgame.egret.com:4000/graphql'),
  operation: getItem('editor:operation', 'query {\n  \n}'),
  variableValues: getItem('editor:value', '{}'),
  docsVisable: getItem('editor:docsVisable', false),
  variableVisable: getItem('editor:variableValues', false),
  rootValue: getItem('editor:rootValue', {}),
  contextValue: getItem('editor:contextValue', {}),
  headers: getItem('editor:headers', {
    userid: '1',
  }) as Record<string, any>,
  response: getItem('editor:response', ''),

  // editor format
  'format:tabSize': 2,
  'format:formatOnBlur': true,
}

export type State = typeof initState

export type Action =
  | { type: 'schemeUrl'; payload: string }
  | { type: 'operation'; payload: string }
  | { type: 'variableValues'; payload: string }
  | { type: 'docsVisable'; payload: boolean }
  | { type: 'variableVisable'; payload: boolean }
  | { type: 'rootValue'; payload: Record<string, any> }
  | { type: 'contextValue'; payload: Record<string, any> }
  | { type: 'headers'; payload: Record<string, any> }
  | { type: 'response'; payload: any }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'schemeUrl':
      setItem('editor:schemeUrl', action.payload)
      return { ...state, schemeUrl: action.payload }
    case 'operation':
      setItem('editor:operation', action.payload)
      return { ...state, operation: action.payload }
    case 'variableValues':
      setItem('editor:value', action.payload)
      return { ...state, variableValues: action.payload }
    case 'variableVisable':
      setItem('editor:variableValues', action.payload)
      return { ...state, variableVisable: action.payload }
    case 'docsVisable':
      setItem('editor:docsVisable', action.payload)
      return { ...state, docsVisable: action.payload }
    case 'rootValue':
      setItem('editor:rootValue', action.payload)
      return { ...state, rootValue: action.payload }
    case 'contextValue':
      setItem('editor:rootValue', action.payload)
      return { ...state, contextValue: action.payload }
    case 'headers':
      setItem('editor:headers', action.payload)
      return { ...state, headers: action.payload }
    case 'response':
      setItem('editor:response', action.payload)
      return { ...state, response: action.payload }
    default:
      return state
  }
}

export default reducer
