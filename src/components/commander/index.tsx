import React, { FC } from 'react'
import { commandContext } from './helper'

const { Provider } = commandContext
export const Commander: FC = props => {
  const { children } = props
  return <Provider>{children}</Provider>
}
