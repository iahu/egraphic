import { RefObject, useEffect, useState } from 'react'

type HTMLElementRef = RefObject<HTMLElement>
export type Vector = { x: number; y: number }
const getPoint = (e: MouseEvent): Vector => ({ x: e.clientX, y: e.clientY })

export interface DragConfig {
  proxyRef: RefObject<HTMLElement>
  onDragStart?: (startPoint: Vector) => void
  onDragMove?: (endPoint: Vector) => void
  onDragEnd?: () => void
}

export const useDrag = (dragConfig: DragConfig) => {
  const { proxyRef, onDragStart, onDragMove, onDragEnd } = dragConfig
  const [dragStart, setDragStart] = useState<boolean>(false)

  useEffect(() => {
    const proxy = proxyRef.current
    if (!proxy) return

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      setDragStart(true)
      onDragStart?.(getPoint(e))
    }
    const handleMouseUp = () => {
      setDragStart(false)
      onDragEnd?.()
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart) return
      const endPoint = getPoint(e)
      onDragMove?.(endPoint)
    }

    proxy.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      proxy.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [proxyRef, dragStart, onDragStart, onDragMove, onDragEnd])
}

export interface DraggableConfig {
  proxyRef: HTMLElementRef
  targetRef: HTMLElementRef
  draggable?: boolean
  onDragStart?: (startPoint: Vector) => void
  onDragMove?: (endPoint: Vector) => void
  onDragEnd?: () => void
}

export const useDraggable = (dragConfig: DraggableConfig) => {
  const { proxyRef, targetRef, draggable, onDragEnd } = dragConfig
  const [startPoint, setStartPoint] = useState<Vector | null>()
  const onDragStart = (startPoint: Vector) => {
    if (draggable) {
      const target = targetRef.current
      if (target) {
        const style = window.getComputedStyle(target)
        const matrix = new DOMMatrix(style.transform)
        setStartPoint({ x: startPoint.x - matrix.m41, y: startPoint.y - matrix.m42 })
      } else {
        setStartPoint(startPoint)
      }
      dragConfig.onDragStart?.(startPoint)
    }
  }
  const onDragMove = (endPoint: Vector) => {
    if (!startPoint) return
    const target = targetRef.current
    if (target) {
      target.style.transform = `translate3d(${endPoint.x - startPoint.x}px, ${endPoint.y - startPoint.y}px, 0)`
    }
    dragConfig.onDragMove?.(endPoint)
  }

  useDrag({ proxyRef, onDragStart, onDragMove, onDragEnd })
}

export type Resizeable = {
  n?: boolean
  e?: boolean
  w?: boolean
  s?: boolean
  se?: boolean
  sw?: boolean
  ne?: boolean
  nw?: boolean
  originX?: number | `${number}%` | 'left' | 'center' | 'right'
  originY?: number | `${number}%` | 'top' | 'center' | 'bottom'
}

export interface ResizeOptions {
  proxyRef: HTMLElementRef
  targetRef: HTMLElementRef
  resizable?: boolean | Resizeable
  onDragStart?: (startRect: DOMRect) => void
  onDragMove?: (endRect: DOMRect) => void
  onDragEnd?: () => void
}

const enabledResizeOptions = {
  n: false,
  w: true,
  s: true,
  e: false,
  sw: true,
  se: true,
  ne: false,
  nw: false,
  originX: 0,
  originY: 0,
}
const disabledResizeOptions = {
  n: false,
  w: false,
  s: false,
  e: false,
  sw: false,
  se: false,
  ne: false,
  nw: false,
  originX: 0,
  originY: 0,
}

const originAlias = { left: '0%', top: '0%', center: '50%', right: '100%', bottom: '100%' } as Record<
  string | number,
  `${number}%`
>
const getOriginPercent = (
  origin: NonNullable<Resizeable['originX']> | NonNullable<Resizeable['originY']>,
  fullSize: number,
) => {
  if (typeof origin === 'number') {
    return origin / fullSize
  }
  const _origin = originAlias[origin] ?? origin
  return parseFloat(_origin) / 100
}

export const useResize = (options: ResizeOptions) => {
  const { proxyRef, targetRef, resizable = true, onDragEnd } = options
  const resizeOptions =
    typeof resizable === 'object' ? resizable : resizable ? enabledResizeOptions : disabledResizeOptions
  const [startTranslate, setStartTranslate] = useState<Vector>({ x: 0, y: 0 })
  const [startPoint, setStartPoint] = useState<Vector>()
  const [rect, setRect] = useState<DOMRect>()

  const onDragStart = (startPoint: Vector) => {
    const target = targetRef.current
    if (resizable && target) {
      setStartPoint(startPoint)

      const style = window.getComputedStyle(target)
      const matrix = new DOMMatrix(style.transform)
      setStartTranslate({ x: matrix.m41, y: matrix.m42 })

      const rect = targetRef.current.getBoundingClientRect()
      setRect(rect)
      options.onDragStart?.(rect)
    }
  }
  const onDragMove = (endPoint: Vector) => {
    const target = targetRef.current
    if (resizable !== 'none' && target && rect && startPoint) {
      const tx = endPoint.x - startPoint.x
      const ty = endPoint.y - startPoint.y
      const originX = getOriginPercent(resizeOptions.originX ?? 0, rect.width)
      const originY = getOriginPercent(resizeOptions.originY ?? 0, rect.height)
      const dx = tx * (1 - originX)
      const dw = tx * originX
      const dy = ty * (1 - originY)
      const dh = ty * originY

      // east ->
      if (resizeOptions.e || resizeOptions.se || resizeOptions.ne) {
        target.style.width = `${rect.width + dx}px`
        target.style.transform = `translate3d(${startTranslate.x + dw}px, ${startTranslate.y}px, 0)`
      }

      // south ↓
      if (resizeOptions.s || resizeOptions.se || resizeOptions.sw) {
        target.style.height = `${rect.height + dy}px`
        target.style.transform = `translate3d(${startTranslate.x}px, ${startTranslate.y + dh}px, 0)`
      }

      // west <-
      if (resizeOptions.w || resizeOptions.sw || resizeOptions.nw) {
        target.style.width = `${rect.width - dx}px`
        target.style.transform = `translate3d(${startTranslate.x + dw}px, ${startTranslate.y}px, 0)`
      }

      // north ↑
      if (resizeOptions.n || resizeOptions.ne || resizeOptions.nw) {
        target.style.height = `${rect.height - dy}px`
        target.style.transform = `translate3d(${startTranslate.x}px, ${startTranslate.y + dh}px, 0)`
      }

      if (resizeOptions.nw) {
        target.style.transform = `translate3d(${startTranslate.x + dw}px, ${startTranslate.y + dh}px, 0)`
      }

      options.onDragMove?.(target.getBoundingClientRect())
    }
  }

  useDrag({ proxyRef, onDragStart, onDragMove, onDragEnd })
}
