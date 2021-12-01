import { IconBtn } from '@components/icon-btn'
import React, { FC } from 'react'
import './style.css'

export const StatusBar = () => {
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <IconBtn id="icon-sidebar_left" />
      </div>
      <div className="status-bar-right"></div>
    </div>
  )
}
