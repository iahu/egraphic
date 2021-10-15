import { omit } from 'lodash-es'
import * as monaco from 'monaco-editor'
// @ts-ignore
import { conf, language } from 'monaco-editor/esm/vs/basic-languages/graphql/graphql'

monaco.languages.register({ id: 'graphql' })

monaco.languages.setMonarchTokensProvider('graphql', language)
monaco.languages.setLanguageConfiguration('graphql', conf)

const _keywordSuggestion = (label: string) => ({
  label,
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: label,
})
const _typeSuggestion = (label: string) => ({
  label,
  kind: monaco.languages.CompletionItemKind.TypeParameter,
  insertText: label,
})

const _keywordSnippetSuggestion = (label: string, snippet: string[]) => ({
  label,
  kind: monaco.languages.CompletionItemKind.Snippet,
  insertText: snippet.join('\n'),
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
})

// Register a completion item provider for the graphql
monaco.languages.registerCompletionItemProvider('graphql', {
  provideCompletionItems: (model, position) => {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    })
    const word = model.getWordUntilPosition(position)
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    }
    const keywordSnippetSuggestions = (
      [
        ['query', ['query ${1:Query} ${2:(${3:\\$arg}: ${4:String!}) }{', '\t$0', '}']],
        ['mutation', ['mutation ${1:Mutation} ${2:(${3:\\$arg}: ${4:String!}) }{', '\t$0', '}']],
        ['subscription', ['subscription ${1:Subscription} ${2:(${3:\\$arg}: ${4:String!}) }{', '\t$0', '}']],
      ] as [string, string[]][]
    ).map(([label, snippet]) => _keywordSnippetSuggestion(label, snippet))

    const suggestions = [
      ...language.keywords.map(_keywordSuggestion),
      ...language.typeKeywords.map(_typeSuggestion),
      ...keywordSnippetSuggestions,
    ].map(s => ({ ...s, range }))

    return { suggestions }
  },
})
