import { IconBtn } from '@components/icon-btn'
import React, { createContext, FC, useContext } from 'react'
import MemoryHistory from './memory-history'

export const NavigateContext = createContext({
  history: new MemoryHistory(),
})

export const NavigatorBar: FC = () => {
  const { history } = useContext(NavigateContext)
  const handleBack = () => {
    history.back()
  }
  const handleForward = () => {
    history.forward()
  }

  return (
    <div className="docs-history-bar">
      <IconBtn title="后退" id="icon-arrow_backward" disabled={!history.history.length} onClick={handleBack}></IconBtn>
      <IconBtn title="前进" id="icon-arrow_forward" disabled={!history.stack.length} onClick={handleForward}></IconBtn>
    </div>
  )
}
