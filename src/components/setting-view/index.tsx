import { Btn } from '@components/btn'
import { Icon } from '@components/icon'
import { Panel } from '@components/panel'
import { parseJSON } from '@components/runner/helper'
import stringify from '@helper/stringify'
import { useEditor } from '@helper/use-editor'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useEffect, useMemo } from 'react'
import './index.css'

type EndString<T extends string> = (str: T) => T extends `${string}.${infer P}` ? P : undefined

const getEndString = <T extends string>(str: T) => {
  return str.split('.').pop() as unknown as EndString<T>
}

export const SettingView: FC = () => {
  const { state, dispatch } = useContext(AppCtx)
  const { schemaUrl, headers, tabSize, formatOnBlur } = state

  const config = useMemo(
    () => ({
      'egraphic.schemaUrl': schemaUrl,
      'editor.tabSize': tabSize,
      'editor.formatOnBlur': formatOnBlur,
      'query.headers': headers,
    }),
    [schemaUrl, tabSize, formatOnBlur, headers],
  )
  type Config = typeof config
  type ConfigKeys = keyof Config

  const editor = useEditor('.setting-editor', {
    language: 'json',
  })
  const handleClick = () => {
    dispatch({ type: 'view', payload: 'queryView' })
  }

  useEffect(() => {
    if (!editor) return
    if (!editor.getValue()) {
      editor.setValue(stringify(config))
    }

    editor.onDidBlurEditorText(() => {
      Object.keys(config).forEach(key => {
        const value = editor.getValue()
        parseJSON<Config>(value).then(val => {
          const type = getEndString(key) as any
          dispatch({ type, payload: val[key as ConfigKeys] })
        })
      })
    })
  }, [editor, config, dispatch])

  return (
    <Panel
      header="设置"
      className="setting-view"
      headerRight={
        <Btn ghost onClick={handleClick}>
          <Icon id="icon-closel" />
        </Btn>
      }
    >
      <div className="editor-container setting-editor"></div>
    </Panel>
  )
}
