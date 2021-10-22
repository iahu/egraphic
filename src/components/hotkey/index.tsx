import React, { FC, useEffect } from 'react'

type Command = (...args: any[]) => any
type ModifyKey = 'ctrl' | 'cmd' | 'ctrl-cmd' | 'cmd-ctrl'
type Key = number | string
export type Hotkeys = `${ModifyKey}-${Key}` | `${ModifyKey}-shift-${Key}` | `${ModifyKey}-alt-${Key}`

const keyMap = new Map<string, Command>()
export const registerHotkey = (keys: Hotkeys[], command: Command) => {
  keyMap.set(keys.join(','), command)
}

export const Hotkey: FC = props => {
  const { children } = props

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const { ctrlKey, altKey, shiftKey, metaKey, key } = event

      event.preventDefault()
    }
    window.addEventListener('keydown', handleKeydown)

    return () => window.addEventListener('keydown', handleKeydown)
  }, [])

  return <>{children}</>
}
