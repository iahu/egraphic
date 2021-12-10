import { api } from 'monaco-graphql'
import * as monaco from 'monaco-editor'

export const setSchemaUri = (url: string) => {
  api.setSchemaUri(url)
}

export const setGraphqlAPI = () => {
  api.setModeConfiguration({
    // documentFormattingEdits: true,
    documentRangeFormattingEdits: true,
    tokens: true,
    foldingRanges: true,
    selectionRanges: true,
    completionItems: true,
    /**
     * @TODO 自己实现 hover
     */
    hovers: true,
    documentSymbols: true,
    diagnostics: true,
  })
}

export const toGraphQLLocation = (position: monaco.IPosition) => {
  return {
    line: position.lineNumber,
    column: position.column,
  }
}
