import { api } from 'monaco-graphql'

export const getSchema = () => api.getSchema()

export const setSchemaUri = (url: string) => {
  api.setSchemaUri(url)
}

export const setGraphqlAPI = () => {
  api.setModeConfiguration({
    documentFormattingEdits: true,
    documentRangeFormattingEdits: true,
    tokens: true,
    foldingRanges: true,
    selectionRanges: true,
    completionItems: true,
    hovers: true,
    documentSymbols: true,
    diagnostics: true,
  })
}
