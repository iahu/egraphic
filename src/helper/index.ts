import { FileSetList, FileType, FolderType } from '@state'
import { TypeMap } from 'graphql/type/schema'

export const fireResizeEvent = () => {
  window.dispatchEvent(new UIEvent('resize'))
}

export const uuid = () => {
  return (Date.now() + ~~(Math.random() * 1000)).toString(36)
}

export const createFile = (name: string): FileType => {
  const id = uuid()
  const now = Date.now()
  return {
    id,
    name,
    type: 'file',
    createTime: now,
    lastModified: now,
    content: { query: 'query {\n  \n}', variable: '{}', response: '' },
  }
}

export const createFolder = (name: string): FolderType => {
  const id = uuid()
  const now = Date.now()
  return {
    id,
    name,
    type: 'folder',
    createTime: now,
    lastModified: now,
    fileList: [],
  }
}

export const findFile = (fileSetList: FileSetList, id: string): FileType | undefined => {
  for (let i = 0; i < fileSetList.length; ++i) {
    const file = fileSetList[i]
    if (file.type === 'file' && file.id === id) {
      return file
    }

    if (file.type === 'folder' && file.fileList?.length) {
      const find = findFile(file.fileList, id)
      if (find) {
        return find
      }
    }
  }
}

export const filterFileList = (fileSetList: FileSetList, id: string): FileSetList => {
  return fileSetList.filter(file => {
    if (file.type === 'folder' && file.fileList?.length) {
      file.fileList = filterFileList(file.fileList, id)
    }
    return file.id !== id
  })
}

export const isNull = (d: unknown): d is null => d === null
export const isString = (d: unknown): d is string => typeof d === 'string'
export const isArray = (d: unknown): d is any[] => Array.isArray(d)
export const isObject = (d: unknown): d is Record<any, any> =>
  Object.prototype.toString.call(d).slice(8, -1) === 'Object'
