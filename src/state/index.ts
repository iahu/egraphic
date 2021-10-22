import { getItem, setItem } from '@helper/use-storage'

export type ObjectType<T = unknown> = Record<string | number, T>
export type Status = 'ok' | 'error' | 'pending'
type ViewType = `${string}View`

export const initState = {
  schemaUrl: getItem('editor:schemeUrl', 'http://instantgame.egret.com:4000/graphql'),
  operation: getItem('editor:operation', 'query {\n  \n}'),
  variable: getItem('editor:value', '{}'),
  docsVisable: getItem('editor:docsVisable', false),
  variableVisable: getItem('editor:variableValues', false),
  view: getItem('editor:view', 'queryView' as ViewType),

  // query
  rootValue: getItem('query:rootValue', {}),
  contextValue: getItem('query:contextValue', {}),
  headers: getItem('query:headers', {
    userid: '1',
  }) as ObjectType,
  operationName: getItem('query:operationName', ''),
  response: getItem('query:response', ''),
  responseStatus: getItem('query:responseStatus', '' as Status),

  // editor format
  tabSize: 2,
  formatOnBlur: true,
}

export type State = typeof initState

export type Action =
  | { type: 'schemaUrl'; payload: string }
  | { type: 'view'; payload: ViewType }
  | { type: 'operation'; payload: string }
  | { type: 'variable'; payload: string }
  | { type: 'docsVisable'; payload: boolean }
  | { type: 'variableVisable'; payload: boolean }
  | { type: 'rootValue'; payload: ObjectType }
  | { type: 'contextValue'; payload: ObjectType }
  | { type: 'headers'; payload: ObjectType }
  | { type: 'response'; payload: any }
  | { type: 'responseStatus'; payload: Status }
  | { type: 'operationName'; payload: string }
  | { type: 'tabSize'; payload: number }
  | { type: 'formatOnBlur'; payload: boolean }

const reducer = (state: State, action: Action): State => {
  /**
   * @todo use immer
   */
  switch (action.type) {
    // global state
    case 'schemaUrl':
      setItem('editor:schemeUrl', action.payload)
      return { ...state, schemaUrl: action.payload }
    case 'view':
      setItem('editor:view', action.payload)
      return { ...state, view: action.payload }
    case 'operation':
      setItem('editor:operation', action.payload)
      return { ...state, operation: action.payload }
    case 'variable':
      setItem('editor:value', action.payload)
      return { ...state, variable: action.payload }
    case 'variableVisable':
      setItem('editor:variableValues', action.payload)
      return { ...state, variableVisable: action.payload }
    case 'docsVisable':
      setItem('editor:docsVisable', action.payload)
      return { ...state, docsVisable: action.payload }

    // editor format
    case 'tabSize':
      setItem('editor:tabSize', action.payload)
      return { ...state, tabSize: action.payload }
    case 'formatOnBlur':
      setItem('editor:tabSize', action.payload)
      return { ...state, formatOnBlur: action.payload }

    // query
    case 'rootValue':
      setItem('query:rootValue', action.payload)
      return { ...state, rootValue: action.payload }
    case 'contextValue':
      setItem('editor:rootValue', action.payload)
      return { ...state, contextValue: action.payload }
    case 'headers':
      setItem('query:headers', action.payload)
      return { ...state, headers: action.payload }
    case 'response':
      setItem('query:response', action.payload)
      return { ...state, response: action.payload }
    case 'responseStatus':
      setItem('query:responseStatus', action.payload)
      return { ...state, responseStatus: action.payload }
    case 'operationName':
      setItem('query:operationName', action.payload)
      return { ...state, operationName: action.payload }

    default:
      return state
  }
}

export default reducer
