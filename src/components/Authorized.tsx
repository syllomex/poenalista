import { useAuth } from '@/providers/auth'
import { PropsWithChildren } from '@/types'

export function Authorized({ children }: PropsWithChildren) {
  const { user } = useAuth()
  if (!user) return null
  return <>{children}</>
}
