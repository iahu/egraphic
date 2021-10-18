import { AppCtx } from '@state/app-ctx'
import * as monaco from 'monaco-editor'
import React, { FC, useContext, useState } from 'react'
import './index.css'
import { useEditor } from './use-editor'

import { create } from 'monaco-graphql/esm/GraphQLWorker'

console.log(create)

export const Editor: FC = () => {
  const { state } = useContext(AppCtx)
  const { operation, schemeUrl } = state
  const [operationEditor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEditor({ container: 'editor-container', operation, schemeUrl }, setEditor)

  return <div id="editor-container"></div>
}
