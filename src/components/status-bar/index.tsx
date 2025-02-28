import { Btn } from '@components/btn'
import { IconBtn } from '@components/icon-btn'
import { FCListBox } from '@i18u/fusion-components'
import { AppCtx } from '@state/app-ctx'
import React, { useContext } from 'react'
import './style.css'

export const StatusBar = () => {
  const { dispatch, state } = useContext(AppCtx)
  const { docsVisable } = state
  const toggleSidebar = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({ type: 'sidebarVisable', payload: !state.sidebarVisable })
  }
  const updateTabSize = (e: React.FormEvent) => {
    e.preventDefault()
    const { target } = e
    if (target instanceof FCListBox) {
      dispatch({ type: 'tabSize', payload: Number(target.value) })
    }
  }
  const toggleAutoFormat = () => {
    dispatch({ type: 'formatOnBlur', payload: !state.formatOnBlur })
  }
  const handleClickDocBtn = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({ type: 'docsVisable', payload: !docsVisable })
  }

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <IconBtn id="icon-sidebar_left" title="Toggle Sidebar" onClick={toggleSidebar} />
        <IconBtn id="icon-book" title="Toggle Document Panel" onClick={handleClickDocBtn} />
      </div>
      <div className="status-bar-right">
        <fc-dropdown class="status-bar-selector">
          <Btn ghost slot="button">
            Spaces: {state.tabSize.toString()}
          </Btn>

          <fc-listbox class="status-bar-listbox" value={state.tabSize.toString()} onChange={updateTabSize}>
            <fc-list-option value="2">2</fc-list-option>
            <fc-list-option value="4">4</fc-list-option>
          </fc-listbox>
        </fc-dropdown>
        <Btn ghost onClick={toggleAutoFormat}>
          Auto Format: {state.formatOnBlur.toString()}
        </Btn>
        <Btn ghost>Schema URL: {state.schemaUrl}</Btn>
      </div>
    </div>
  )
}
