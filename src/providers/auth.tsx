import { firebaseAuthProvider } from '@/services'
import type { ComponentWithChildren, SetState } from '@/types'
import { useStoredState } from '@/utils'
import { getAuth, signInWithPopup, User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'

const auth = getAuth()

const AuthContext = createContext(
  {} as {
    user?: User | null
    setUser: SetState<User | null | undefined>
    loading: boolean
    setLoading: SetState<boolean>
  }
)

export const AuthProvider: ComponentWithChildren = ({ children }) => {
  const [user, setUser] = useStoredState<User>('auth-user')
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return
    if (user === undefined) setLoading(true)
    else {
      setLoading(false)
      setInitialized(true)
    }
  }, [initialized, user])

  return (
    <AuthContext.Provider value={{ user, setUser, setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const { setUser, user, loading, setLoading } = useContext(AuthContext)

  const login = async () => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, firebaseAuthProvider)
      setUser(result.user)
    } finally {
      setLoading(false)
    }
  }

  return { login, user, loading, setLoading }
}
