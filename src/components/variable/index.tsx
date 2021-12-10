import { Btn } from '@components/btn'
import { Panel } from '@components/panel'
import { AppCtx } from '@state/app-ctx'
import React, { FC, useContext, useState } from 'react'
import { HeadersEditor } from './headers-editor'
import './index.css'
import { VariableEditor } from './variable-editor'

type View = 'variable' | 'headers'

const views = [
  { name: '变量', id: 'variable' },
  { name: '请求头', id: 'headers' },
]

export const Variable: FC = () => {
  const {
    state: { variableVisable },
    dispatch,
  } = useContext(AppCtx)
  const [view, setView] = useState<View>('variable')

  const handleCollapse = (collapsed: boolean) => {
    dispatch({ type: 'variableVisable', payload: !collapsed })
  }
  const handleSwitch = (e: React.MouseEvent) => {
    const target = e.nativeEvent.target as HTMLElement
    const nextView = target.dataset.id as View
    setView(nextView)
  }

  const onResize = () => window.dispatchEvent(new UIEvent('resize'))

  return (
    <Panel
      name={
        <span className="switcher">
          {views.map(v => (
            <Btn
              ghost
              key={v.id}
              selected={v.id === view}
              readOnly={v.id === view}
              className={'switcher-btn'}
              onClick={handleSwitch}
              data-id={v.id}
            >
              {v.name}
            </Btn>
          ))}
        </span>
      }
      width="auto"
      height="132px"
      minimize={!variableVisable}
      className="variable"
      thin
      minimizeBtn
      onMinimize={handleCollapse}
      resizable={{ n: true, originY: 'bottom' }}
      onResize={onResize}
    >
      {view === 'variable' && <VariableEditor />}
      {view === 'headers' && <HeadersEditor />}
    </Panel>
  )
}
