import { Panel } from '@components/panel'
import { getSchema } from '@components/runner/helper'
import { GraphQLSchema } from 'graphql'
import React, { FC, useEffect, useState } from 'react'
import './index.css'

export const Docs: FC = () => {
  const [schema, setSchema] = useState<GraphQLSchema>()
  useEffect(() => {
    getSchema().then(setSchema)
  }, [])

  console.log(schema)

  return (
    <div className="docs">
      <Panel header="文档">文档</Panel>
    </div>
  )
}
