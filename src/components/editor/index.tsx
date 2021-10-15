import { AppCtx } from '@state/app-ctx'
import * as monaco from 'monaco-editor'
import React, { FC, useContext, useState } from 'react'
import './index.css'
import { useEditor } from './use-editor'

export const Editor: FC = () => {
  const { state } = useContext(AppCtx)
  const { operation, gqOrigin } = state
  const [operationEditor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEditor({ container: 'editor-container', operation, gqOrigin }, setEditor)
  console.log(operationEditor)

  return <div id="editor-container"></div>
}
