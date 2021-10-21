import { Variable } from '@components/variable'
import React, { FC } from 'react'
import { Editor } from '../editor'
import './index.css'

export const Operator: FC = () => {
  return (
    <div className="operator">
      <Editor />
      <Variable />
    </div>
  )
}
