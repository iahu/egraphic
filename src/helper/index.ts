import { FileType, FolderType } from '@state'

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
    content: { query: '', variable: '', response: '' },
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
    FileList: [],
  }
}
