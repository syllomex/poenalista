import { useEffect, useState } from 'react'

export const useStoredState = <T = unknown>(key: string, initialValue?: T) => {
  const [state, setState] = useState<T | undefined | null>(initialValue)

  useEffect(() => {
    if (state === undefined) {
      const stored = localStorage.getItem(key)
      if (stored) {
        setState(JSON.parse(stored))
      } else {
        setState(null)
      }
    }
  }, [key, state])

  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(key, JSON.stringify(state))
    }
  }, [key, state])

  return [state, setState] as const
}
