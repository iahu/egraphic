import { Variable } from '@components/variable'
import React, { FC } from 'react'
import { Query } from '../query'
import './index.css'

export const Operator: FC = () => {
  return (
    <div className="operator">
      <Query />
      <Variable />
    </div>
  )
}
