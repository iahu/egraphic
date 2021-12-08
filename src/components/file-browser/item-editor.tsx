import { Icon } from '@components/icon'
import { FCInput } from '@egret/fusion-components'
import { FileSet, FileSetList } from '@state/index'
import React, { FC, useEffect, useRef } from 'react'

export interface Props {
  defaultName?: string
  type?: FileSet['type']
  onOk?: (name: string, type: string) => void
  fileList?: FileSetList
}

export const ItemEditor: FC<Props> = props => {
  const { type = 'file', defaultName = `untitled ${type}`, onOk } = props
  const inputRef = useRef<FCInput>(null)
  useEffect(() => {
    if (type && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [type, inputRef])

  const handleBlur = (e: React.FocusEvent) => {
    const { currentTarget } = e
    if (currentTarget instanceof FCInput) {
      const type = currentTarget.dataset.type as string
      const name = currentTarget.value as string
      onOk?.(name, type)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    const { currentTarget } = e
    if (currentTarget instanceof FCInput && e.key === 'Enter') {
      const type = currentTarget.dataset.type as string
      const name = currentTarget.value as string
      onOk?.(name, type)
    }
  }

  return (
    <fc-input
      ref={inputRef}
      class="item-editor-input"
      placeholder="input name"
      value={defaultName}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      data-type={type}
    >
      <span slot="before" className="input-type-icon">
        <Icon
          className="file-browser-file-type-icon"
          id={type === 'file' ? 'icon-graphql' : 'icon-folder-graphql'}
          size={14}
        />
      </span>
    </fc-input>
  )
}
