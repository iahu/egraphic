import { Panel } from '@components/panel'
import { getSchema } from '@components/runner/helper'
import { fireResizeEvent } from '@helper'
import { AppCtx } from '@state/app-ctx'
import {
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import './index.css'
import MemoryHistory from './memory-history'
import { NavigateContext, NavigatorBar } from './navigator-bar'

export interface Props {
  width?: number | string
}

export const Docs: FC<Props> = props => {
  const { width } = props
  const { dispatch } = useContext(AppCtx)
  const [schema, setSchema] = useState<GraphQLSchema>()
  const [fieldType, setFieldType] = useState('')
  const history = useMemo(() => new MemoryHistory(), [])

  useEffect(() => {
    const handleHashChange = (e: Event) => {
      if (e instanceof CustomEvent) {
        setFieldType(e.detail.newURL)
      }
    }
    window.addEventListener('stateChange', handleHashChange)
    return () => window.removeEventListener('stateChange', handleHashChange)
  }, [])

  useEffect(() => {
    getSchema().then(setSchema)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch({ type: 'docsVisable', payload: false })
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.nativeEvent.target as HTMLElement
    const type = target.dataset.type
    if (type) {
      history.pushState(type)
    }
  }

  const onResize = () => fireResizeEvent()

  let typeMap = {} as Record<string, GraphQLNamedType>
  if (fieldType) {
    const type = schema?.getType(fieldType)
    if (type) {
      typeMap = {
        fieldType: type,
      }
    }
  } else {
    const queryType = schema?.getQueryType()
    const mutationType = schema?.getMutationType()
    typeMap = { queryType, mutationType } as Record<string, GraphQLNamedType>
  }

  const docs = Object.keys(typeMap).map(key => {
    const type = typeMap[key]
    if (!type) {
      return null
    }
    const { name, description } = type

    if (
      type instanceof GraphQLObjectType ||
      type instanceof GraphQLInputObjectType ||
      type instanceof GraphQLInterfaceType
    ) {
      const fields = type.getFields()
      return (
        <React.Fragment key={key}>
          {type.description && <li className="line comment"># {type.description}</li>}
          <li className="line">
            <span className="token type-name name" id={type.name}>
              {type.name}
            </span>
            <span className="token punctuation block">{' {'}</span>
          </li>
          {Object.keys(fields).map(key => {
            const field = fields[key]
            return (
              <li className="line" key={key}>
                <span className="indent">&nbsp;&nbsp;</span>
                <span className="token field-name name">{field.name}</span>
                <span className="token punctuation colon">: </span>
                <span className="token type">
                  <a
                    data-type={`${field.type.inspect().replace(/\W*(\w+)[\]!]*/, '$1')}`}
                    href={`#${field.type.inspect().replace(/\W*(\w+)[\]!]*/, '$1')}`}
                    className="type-link"
                    onClick={handleLinkClick}
                  >
                    {field.type.inspect()}
                  </a>
                </span>
                {field.description && <span className="comment inline-comment">&nbsp;&nbsp;# {field.description}</span>}
              </li>
            )
          })}
          <li className="line">
            <span className="token punctuation block">{'}'}</span>
          </li>
          <li className="line"></li>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment key={key}>
        {description && <li className="line comment"># {description}</li>}
        <li className="line">
          <span className="token keywords">scalar</span>
          <span className="token punctuation colon">: </span>
          <span className="token type" id={name}>
            <a
              data-type={`${name.replace(/\W*(\w+)[\]!]*/, '$1')}`}
              href={`#${name.replace(/\W*(\w+)[\]!]*/, '$1')}`}
              className="type-link"
              onClick={handleLinkClick}
            >
              {name}
            </a>
          </span>
        </li>
        <li className="line"></li>
      </React.Fragment>
    )
  })

  return (
    <Panel
      className="docs"
      name="文档"
      closeBtn
      maximizeBtn
      onClose={handleClick}
      headerRight={
        <NavigateContext.Provider value={{ history }}>
          <NavigatorBar />
        </NavigateContext.Provider>
      }
      width={width}
      resizable={{ e: true }}
      onResize={onResize}
    >
      <ul className="docs-body">{docs}</ul>
    </Panel>
  )
}
