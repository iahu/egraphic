import { createContext } from 'react'

export type Command = {
  name: string
  command: (...args: any[]) => void
  hotkeys: string[] | string
  // context: Context[]
}

const commandMap = new Map<string, Command>()

export const registerCommand = (command: Command) => {
  commandMap.set(command.name, command)
}

export const runCommand = (name: string, args: any[]) => {
  commandMap.get(name)?.command(...args)
}

export const commandContext = createContext({ commandMap, registerCommand, runCommand })
