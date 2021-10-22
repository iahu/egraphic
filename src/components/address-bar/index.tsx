import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext } from 'react'
import './index.css'

export const AddressBar: FC = () => {
  const { state, dispatch } = useContext(AppCtx)
  const handleChange = (event: React.ChangeEvent) => {
    if (event.target instanceof HTMLInputElement) {
      const schemaUrl = event.target.value.trim()
      if (schemaUrl) {
        dispatch({ type: 'schemaUrl', payload: schemaUrl })
      }
    }
  }
  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement && event.key === 'Enter') {
      event.preventDefault()
      const schemaUrl = event.target.value.trim()
      if (schemaUrl) {
        dispatch({ type: 'schemaUrl', payload: schemaUrl })
      }
    }
  }

  return (
    <div className="address-bar">
      <input
        className="address-input"
        type="url"
        defaultValue={state.schemaUrl}
        onBlur={handleChange}
        onKeyUp={handleKeydown}
      />
    </div>
  )
}
