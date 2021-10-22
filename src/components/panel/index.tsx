import React, { FC, useEffect, useState } from 'react'
import classnames from 'classnames'
import './index.css'
import { FolderBtn } from '../folder-btn'

export interface Props {
  className?: string
  header: React.ReactNode
  headerMiddle?: React.ReactNode
  headerRight?: React.ReactNode
  thin?: boolean
  foldable?: boolean
  folded?: boolean
  hardFold?: boolean
  onCollapse?: (collapsed: boolean) => void
  hidden?: boolean
}

export const Panel: FC<Props> = props => {
  const {
    className,
    header,
    children,
    thin,
    foldable,
    folded: _folded,
    hardFold,
    headerMiddle,
    headerRight,
    onCollapse,
    hidden,
  } = props
  const [folded, setFolded] = useState(_folded)
  const handleCollapse = () => {
    if (!foldable) return
    setFolded(!folded)
    onCollapse?.(!folded)
  }

  useEffect(() => {
    setFolded(_folded)
  }, [_folded])

  return (
    <div className={classnames('panel', className, { thin, folded, hidden })}>
      <div className="panel-header" tabIndex={Number(!!foldable) - 1} onClick={handleCollapse}>
        <div className="panel-header-left">
          {foldable && <FolderBtn className="panel-header-folder" collapsed={folded} />}
          {header}
        </div>
        {headerMiddle ? <div className="panel-header-middle">{headerMiddle}</div> : null}
        {headerRight ? <div className="panel-header-right">{headerRight}</div> : null}
      </div>
      {!(hardFold && folded) && <div className="panel-body">{children}</div>}
    </div>
  )
}
