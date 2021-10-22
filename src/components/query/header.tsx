import { AddressBar } from '@components/address-bar'
import { CollapseBtn } from '@components/collapse-btn'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext } from 'react'

export const Header: FC = () => {
  const { state, dispatch } = useContext(AppCtx)
  const handleClick = () => dispatch({ type: 'docsVisable', payload: !state.docsVisable })
  return (
    <>
      <CollapseBtn onClick={handleClick} className="docs-collapsed" collapsed={!state.docsVisable} />
      <span>查询</span>
      <AddressBar />
    </>
  )
}
