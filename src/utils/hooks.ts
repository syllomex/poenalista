import { DependencyList, useCallback, useState } from 'react'

export const useAsyncAction = (
  handler: () => Promise<unknown>,
  deps: DependencyList
) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await handler()
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps])

  return [execute, { loading, error }] as const
}
