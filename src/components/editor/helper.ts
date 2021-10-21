import { api as GraphQLAPI } from 'monaco-graphql'

export const configGraphqlAPI = (schemaUrl: string) => {
  GraphQLAPI.setSchemaUri(schemaUrl)
  GraphQLAPI.setModeConfiguration({
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
  GraphQLAPI.setFormattingOptions({
    prettierConfig: { tabWidth: 2, useTabs: true, printWidth: 120 },
  })
}
