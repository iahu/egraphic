import { Icon } from '@components/icon'
import { Vector } from '@components/panel/use-dng'
import { FCMenu } from '@egret/fusion-components'
import React, { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './style.css'

export interface MenuItem {
  name: string
  id: string
  icon?: string
}

const defaultMenus: MenuItem[] = [
  { id: 'createFile', name: '新建文件', icon: 'icon-file' },
  { id: 'createFolder', name: '新建文件夹', icon: 'icon-folder' },
  { id: 'rename', name: '重命名', icon: 'icon-rename' },
  { id: 'delete', name: '删除', icon: 'icon-delete' },
]

export interface Props {
  container?: HTMLElement | null
  dataSource?: MenuItem[]
  children?: React.ReactElement
  onClick?: (id: string, event: React.MouseEvent) => void
  /** disabled id list */
  disabled?: string[]
}

export const ContextMenu: FC<Props> = props => {
  const { container = document.body, dataSource = defaultMenus, disabled = [], children, onClick } = props
  const [position, setPosition] = useState<Vector | null>(null)
  const menuRef = useRef<FCMenu>(null)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // 阻止冒泡

    children?.props.onContextMenu?.(e)
    setPosition({ x: e.clientX, y: e.clientY })
  }
  const childrenClone = children ? React.cloneElement(children, { onContextMenu: handleContextMenu }) : null
  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (e.target.parentNode) {
        setPosition(null)
      }
    }, 100)
  }
  const handleClick = (e: React.MouseEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      onClick?.(e.currentTarget.dataset.id ?? '', e)
    }
  }

  useEffect(() => {
    menuRef.current?.focus()
  }, [menuRef, position])

  if (!children) {
    return null
  }

  const menu = (
    <fc-menu
      ref={menuRef}
      class="context-menu"
      style={{ left: position?.x, top: position?.y }}
      hidden={!position ? true : undefined}
      onBlur={handleBlur}
    >
      {dataSource.map(item => (
        <fc-menu-item
          data-id={item.id}
          key={item.id ?? item.name}
          role="menuitem"
          onClick={handleClick}
          disabled={disabled.includes(item.id)}
        >
          {item.icon && (
            <span slot="before">
              <Icon id={item.icon} size={12} />
            </span>
          )}
          <span>{item.name}</span>
        </fc-menu-item>
      ))}
    </fc-menu>
  )

  return (
    <>
      {childrenClone}
      {position && container ? createPortal(menu, container) : null}
    </>
  )
}
