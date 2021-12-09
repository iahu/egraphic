import { IconBtn } from '@components/icon-btn'
import React, { FC, useEffect, useState } from 'react'

export const NavigatorBar: FC = () => {
  const [hash, setHash] = useState('')
  const [stack, setStack] = useState(0)

  useEffect(() => {
    const handleChange = () => {
      setHash(location.hash.slice(1))
    }

    window.addEventListener('hashchange', handleChange)

    return () => {
      window.removeEventListener('hashchange', handleChange)
    }
  }, [])

  const handleBack = () => {
    window.history.back()
    setStack(stack + 1)
  }
  const handleForward = () => {
    setStack(stack - 1)
    window.history.forward()
  }

  return (
    <div className="docs-history-bar">
      <IconBtn title="后退" id="icon-arrow_backward" disabled={!hash} onClick={handleBack}></IconBtn>
      <IconBtn title="前进" id="icon-arrow_forward" disabled={stack <= 0} onClick={handleForward}></IconBtn>
    </div>
  )
}
