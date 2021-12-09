import * as monaco from 'monaco-editor'
import { getItem, setItem } from '@helper/use-storage'
import { findFile } from '@helper'

export type ObjectType<T = unknown> = Record<string | number, T>
export type Status = 'ok' | 'error' | 'pending'
type ViewType = `${string}View`

export interface QueryFile {
  id: string
  name: string
  createTime: number
  lastModified: number
}

export interface FileType extends QueryFile {
  type: 'file'
  // file content
  content: {
    query: string
    variable: string
    response: string
  }
}

export interface FolderType extends QueryFile {
  type: 'folder'
  fileList: FileSet[]
}

export type FileSet = FileType | FolderType

export type FileSetList = FileSet[]

export type OpenedFile = {
  id: string
  name: string
}

export const initState = {
  // inner global variable
  queryEditor: null as monaco.editor.IStandaloneCodeEditor | null,

  // global variable
  schemaUrl: getItem('egraphic.schemeUrl', 'http://instantgame.egret.com:4000/graphql'),
  query: getItem('egraphic.query', 'query {\n  \n}'),
  variable: getItem('egraphic.variable', '{}'),
  docsVisable: getItem('egraphic.docsVisable', false),
  sidebarVisable: getItem('egraphic.sidebarVisable', true),
  variableVisable: getItem('egraphic.variableValues', false),
  view: getItem('egraphic.view', 'queryView' as ViewType),

  // query
  rootValue: getItem('query.rootValue', {}),
  contextValue: getItem('query.contextValue', {}),
  headers: getItem<string>('query.headers', '{userid: "1", }'),
  operationName: getItem('query.operationName', ''),
  response: getItem('query.response', ''),
  responseStatus: getItem('query.responseStatus', '' as Status),

  // editor format
  tabSize: getItem('editor.tabSize', 2),
  formatOnBlur: getItem('editor.formatOnBlur', true),

  fileList: getItem<FileSetList>('editor.fileList', []),
  openedFileList: getItem<OpenedFile[]>('editor.openedFileList', []),
}

export type State = typeof initState

export type Action =
  | { type: 'queryEditor'; payload: monaco.editor.IStandaloneCodeEditor }
  | { type: 'schemaUrl'; payload: string }
  | { type: 'view'; payload: ViewType }
  | { type: 'query'; payload: string }
  | { type: 'variable'; payload: string }
  | { type: 'docsVisable'; payload: boolean }
  | { type: 'sidebarVisable'; payload: boolean }
  | { type: 'variableVisable'; payload: boolean }
  | { type: 'rootValue'; payload: ObjectType }
  | { type: 'contextValue'; payload: ObjectType }
  | { type: 'headers'; payload: string }
  | { type: 'response'; payload: any }
  | { type: 'responseStatus'; payload: Status }
  | { type: 'operationName'; payload: string }
  | { type: 'tabSize'; payload: number }
  | { type: 'formatOnBlur'; payload: boolean }
  | { type: 'fileList'; payload: FileSetList }
  | { type: 'openedFileList'; payload: OpenedFile[] }
  | { type: 'swapFile'; payload: FileType }

const reducer = (state: State, action: Action): State => {
  /**
   * @todo use immer
   */
  switch (action.type) {
    // global state
    case 'schemaUrl':
      setItem('egraphic.schemeUrl', action.payload)
      return { ...state, schemaUrl: action.payload }
    case 'view':
      setItem('egraphic.view', action.payload)
      return { ...state, view: action.payload }
    case 'query':
      setItem('egraphic.query', action.payload)
      return { ...state, query: action.payload }
    case 'variable':
      setItem('egraphic.variable', action.payload)
      return { ...state, variable: action.payload }
    case 'variableVisable':
      setItem('egraphic.variableValues', action.payload)
      return { ...state, variableVisable: action.payload }
    case 'docsVisable':
      setItem('egraphic.docsVisable', action.payload)
      return { ...state, docsVisable: action.payload }
    case 'sidebarVisable':
      setItem('egraphic.sidebarVisable', action.payload)
      return { ...state, sidebarVisable: action.payload }

    // editor format
    case 'tabSize':
      setItem('editor.tabSize', action.payload)
      return { ...state, tabSize: action.payload }
    case 'formatOnBlur':
      setItem('editor.formatOnBlur', action.payload)
      return { ...state, formatOnBlur: action.payload }

    // query
    case 'rootValue':
      setItem('query.rootValue', action.payload)
      return { ...state, rootValue: action.payload }
    case 'contextValue':
      setItem('editor.rootValue', action.payload)
      return { ...state, contextValue: action.payload }
    case 'headers':
      setItem('query.headers', action.payload)
      return { ...state, headers: action.payload }
    case 'response':
      setItem('query.response', action.payload)
      return { ...state, response: action.payload }
    case 'responseStatus':
      setItem('query.responseStatus', action.payload)
      return { ...state, responseStatus: action.payload }
    case 'operationName':
      setItem('query.operationName', action.payload)
      return { ...state, operationName: action.payload }

    // file
    case 'fileList':
      setItem('editor.fileList', action.payload)
      return { ...state, fileList: action.payload }
    case 'openedFileList':
      setItem('editor.openedFileList', action.payload)
      return { ...state, openedFileList: action.payload }
    case 'swapFile': {
      const { payload } = action
      const { id, name } = payload
      const { fileList, openedFileList, query, variable, response } = state
      const selectedFile = findFile(fileList, id)
      const openedFile = findFile(fileList, openedFileList[0]?.id)
      const bufferedContent = { query, variable, response }

      if (openedFile) {
        // save buffer as file content
        openedFile.content = bufferedContent
        openedFile.lastModified = Date.now()
        setItem('editor.fileList', state.fileList)
        state = { ...state, fileList: [...fileList] }
      }

      if (selectedFile) {
        // set the selected file as buffer
        const fileContent = { ...selectedFile.content }
        setItem('editor.openedFileList', [{ id, name }])
        setItem('egraphic.query', query)
        setItem('egraphic.variable', variable)
        setItem('egraphic.response', response)
        state = { ...state, openedFileList: [{ id, name }], ...fileContent }
      }

      return state
    }
    default:
      return state
  }
}

export default reducer
