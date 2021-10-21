import { useCallback, useEffect, useState } from 'react'

export const getItem = <T>(key: string, defaults?: T): T => {
  const item = localStorage.getItem(key)
  if (item === null) {
    setItem(key, defaults)
    return defaults as T
  }
  return JSON.parse(item)
}

export const setItem = <T>(key: string, data: T | null) => {
  try {
    const string = JSON.stringify(data)
    return localStorage.setItem(key, string)
  } catch (error) {
    console.error(error)
  }
}

export const updateItem = <T>(key: string, data: Partial<T> | null) => {
  const item = getItem(key)
  return localStorage.setItem(key, JSON.stringify({ ...item, ...data }))
}

export const useStorage = <T>(key: string, initState: T | null) => {
  const [state, _setState] = useState(initState)
  const setState = useCallback(
    (nextState: T | null) => {
      setItem(key, nextState)
      _setState(nextState)
    },
    [key],
  )

  useEffect(() => {
    setItem(key, initState)
  }, [initState, key])

  return [state, setState] as const
}
