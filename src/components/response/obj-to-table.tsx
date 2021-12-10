import { isArray, isObject } from '@helper'
import { replacer } from '@helper/stringify'
import React, { FC } from 'react'
import { ArrayToTable } from './array-to-table'

export interface Props {
  dataSource: Record<string | number, any>
}

export const ObjToTable: FC<Props> = props => {
  const { dataSource } = props
  const keys = Object.keys(dataSource)

  return (
    <table>
      {keys.length > 1 && (
        <thead>
          <tr>
            {keys.map(key => (
              <th key={`th-${key}`}>{key}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        <tr>
          {keys.length === 1 && <th>{keys[0]}</th>}
          {keys.map(key => {
            const data = dataSource[key]
            return (
              <td key={key}>
                {isArray(data) ? (
                  <ArrayToTable key={key} dataSource={data} />
                ) : isObject(data) ? (
                  <ObjToTable dataSource={data} />
                ) : (
                  replacer(data)
                )}
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}
