import classnames from 'classnames'
import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react'
import { FrameBtn } from './frame-btn'
import './index.css'
import { Resizeable, useDraggable, useResize, Vector } from './use-dng'

export interface Props {
  className?: string
  thin?: boolean
  name?: React.ReactNode
  header?: boolean
  border?: boolean
  headerMiddle?: React.ReactNode
  headerRight?: React.ReactNode

  x?: number
  y?: number
  width?: number | string
  height?: number | string
  draggable?: boolean
  resizable?: boolean | Resizeable
  onDragStart?: (startPoint: Vector) => void
  onDragMove?: (endPoint: Vector) => void
  onDragEnd?: () => void
  onResize?: (rect: DOMRect) => void
  onResizeEnd?: () => void

  onClick?: (event: React.MouseEvent) => void

  closeBtn?: boolean
  hidden?: boolean
  onClose?: (event: React.MouseEvent) => void

  maximizeBtn?: boolean
  maximize?: boolean
  onMaximize?: (maximize: boolean) => void

  minimizeBtn?: boolean
  minimize?: boolean
  onMinimize?: (minimize: boolean) => void
  hardMinimize?: boolean
}

export const Panel: FC<Props> = props => {
  const {
    className,
    thin = false,
    name,
    children,
    header = true,
    border = false,

    x = 0,
    y = 0,
    width = '100%',
    height = '100%',
    draggable = false,
    resizable = false,
    onDragStart,
    onDragMove,
    onDragEnd,
    onResize,
    onResizeEnd,

    closeBtn = false,
    onClose,
    hidden,

    maximizeBtn = false,
    maximize: _maximize,
    onMaximize,

    minimizeBtn = false,
    minimize,
    onMinimize,
    hardMinimize,

    headerMiddle,
    headerRight,

    onClick,
  } = props
  const resize =
    typeof resizable === 'object'
      ? resizable
      : resizable
      ? { n: !header, w: true, s: true, e: false }
      : { n: false, w: false, s: false, e: false }
  const [folded, setFolded] = useState(minimize)
  const handleMinimize = () => {
    setFolded(!folded)
    onMinimize?.(!folded)
    // setTimeout(() => {
    //   window.dispatchEvent(new UIEvent('resize'))
    // })
  }
  const [maximize, setMaximize] = useState(_maximize)
  const handleMaximize = () => {
    setMaximize(!maximize)
    onMaximize?.(!maximize)
    // setTimeout(() => {
    //   window.dispatchEvent(new UIEvent('resize'))
    // })
  }

  useEffect(() => {
    setFolded(minimize)
  }, [minimize])
  useEffect(() => {
    setMaximize(_maximize)
  }, [_maximize])

  const panelRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  useDraggable({ proxyRef: headerRef, targetRef: panelRef, draggable, onDragStart, onDragMove, onDragEnd })

  const resizeTopRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeTopRef,
    targetRef: panelRef,
    resizable: { n: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })
  const resizeBottomRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeBottomRef,
    targetRef: panelRef,
    resizable: { s: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })

  const resizeLeftRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeLeftRef,
    targetRef: panelRef,
    resizable: { w: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })
  const resizeRightRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeRightRef,
    targetRef: panelRef,
    resizable: { e: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })

  const resizeBottomLeftRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeBottomLeftRef,
    targetRef: panelRef,
    resizable: { sw: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })
  const resizeBottomRightRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeBottomRightRef,
    targetRef: panelRef,
    resizable: { se: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })

  const resizeTopLeftRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeTopLeftRef,
    targetRef: panelRef,
    resizable: { nw: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })
  const resizeTopRightRef = useRef<HTMLDivElement>(null)
  useResize({
    proxyRef: resizeTopRightRef,
    targetRef: panelRef,
    resizable: { ne: true },
    onDragMove: onResize,
    onDragEnd: onResizeEnd,
  })

  const style = { transform: `translate(${x}px, ${y}px)` } as CSSProperties
  if (!maximize) {
    style.width = width
    if (!folded) {
      style.height = height
    }
  }

  return (
    <div
      className={classnames('panel', className, { border, thin, folded, hidden, draggable, maximize })}
      ref={panelRef}
      style={style}
    >
      {header && (
        <div className="panel-header" tabIndex={Number(!!minimizeBtn) - 1} ref={headerRef}>
          <div className="panel-header-left" onClick={onClick}>
            {closeBtn && <FrameBtn className="close-btn" id="icon-close" onClick={onClose} />}
            {minimizeBtn && (
              <FrameBtn
                disabled={maximize}
                className="minimize-btn"
                id={folded ? 'icon-chevron_up' : 'icon-chevron_down'}
                onClick={handleMinimize}
              />
            )}
            {maximizeBtn && (
              <FrameBtn className="maximize-btn" id={maximize ? 'icon-remove' : 'icon-add'} onClick={handleMaximize} />
            )}
            {name && <span className="panel-header-name">{name}</span>}
          </div>
          {headerMiddle ? <div className="panel-header-middle">{headerMiddle}</div> : null}
          {headerRight ? <div className="panel-header-right">{headerRight}</div> : null}
        </div>
      )}

      {!(hardMinimize && folded) && <div className="panel-body">{children}</div>}

      {resize.e && <div className="panel-resize-bar panel-resize-right" ref={resizeRightRef}></div>}
      {resize.s && <div className="panel-resize-bar panel-resize-bottom" ref={resizeBottomRef}></div>}
      {resize.w && <div className="panel-resize-bar panel-resize-left" ref={resizeLeftRef}></div>}
      {resize.n && <div className="panel-resize-bar panel-resize-top" ref={resizeTopRef}></div>}
      {resize.e && resize.s && (
        <div className="panel-resize-bar panel-resize-right-bottom" ref={resizeBottomRightRef}></div>
      )}
      {resize.w && resize.s && (
        <div className="panel-resize-bar panel-resize-left-bottom" ref={resizeBottomLeftRef}></div>
      )}
      {resize.e && resize.n && <div className="panel-resize-bar panel-resize-right-top" ref={resizeTopRightRef}></div>}
      {resize.w && resize.n && <div className="panel-resize-bar panel-resize-left-top" ref={resizeTopLeftRef}></div>}
    </div>
  )
}
