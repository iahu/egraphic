import { Icon } from '@components/icon'
import React, { FC } from 'react'
import './index.css'

export const Header: FC = () => {
  return (
    <div id="header">
      <div className="header-left">
        Egraphic <Icon size={18} id="icon-seo-marketing-business-diagram-vin-infographics" />
      </div>
      <div className="header-middle"></div>
      <div className="header-right">
        <Icon id="icon-shezhi1" className="setting-icon" size={18} />
      </div>
    </div>
  )
}
