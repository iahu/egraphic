import { isArray, isObject } from '@helper'
import { replacer } from '@helper/stringify'
import React, { FC } from 'react'
import { ObjToTable } from './obj-to-table'

export interface Props {
  dataSource: any[]
}

const Row: FC = props => <tr>{props.children}</tr>
const Empty: FC = props => <>{props.children}</>

export const ArrayToTable: FC<Props> = props => {
  const { dataSource } = props

  if (isArray(dataSource) && dataSource.length <= 1) {
    const data = dataSource[0]
    return isArray(data) ? (
      <ArrayToTable dataSource={data} />
    ) : isObject(data) ? (
      <ObjToTable dataSource={data} />
    ) : (
      <>{data ?? '-'}</>
    )
  }

  const aoo = dataSource.some(isObject)
  const headers = aoo ? Object.keys(dataSource[0]) : []
  const Wrapper = headers.length > 1 ? Row : Empty

  const rows = dataSource.map((data, idx) => {
    if (isArray(data)) {
      return (
        <Wrapper key={`at-${idx}`}>
          <td key={`ad-${idx}`}>
            <ArrayToTable dataSource={data} />
          </td>
        </Wrapper>
      )
    } else if (isObject(data)) {
      const keys = Object.keys(data)
      return (
        <Wrapper key={idx}>
          {keys.map(key => {
            const item = data[key]
            return (
              <td key={key}>
                {isArray(item) ? (
                  <ArrayToTable key={key} dataSource={item} />
                ) : isObject(item) ? (
                  <ObjToTable dataSource={item} />
                ) : (
                  item ?? '-'
                )}
              </td>
            )
          })}
        </Wrapper>
      )
    } else {
      return (
        <Wrapper key={data}>
          <td key={`td-${data}`}>{replacer(data)}</td>
        </Wrapper>
      )
    }
  })

  return (
    <table className="array-to-table">
      {headers.length > 1 && (
        <thead>
          <tr>
            {headers.map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {headers.length <= 1 ? (
          <tr>
            {headers.length > 0 && <th>{headers[0]}</th>}
            {rows}
          </tr>
        ) : (
          rows
        )}
      </tbody>
    </table>
  )
}
