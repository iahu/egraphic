import { Btn } from '@components/btn'
import { Icon } from '@components/icon'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext } from 'react'
import './index.css'

export const Header: FC = () => {
  const { dispatch } = useContext(AppCtx)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({ type: 'view', payload: 'settingView' })
  }

  return (
    <div id="header">
      <div className="header-left">
        Egraphic <Icon size={18} id="icon-seo-marketing-business-diagram-vin-infographics" />
      </div>
      <div className="header-middle"></div>
      <div className="header-right">
        <Btn onClick={handleClick} ghost>
          <Icon id="icon-shezhi1" className="setting-icon" size={18} />
        </Btn>
      </div>
    </div>
  )
}
