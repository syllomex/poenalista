import { firebaseAuthProvider } from '@/services'
import type { ComponentWithChildren, SetState } from '@/types'
import { useStoredState } from '@/utils'
import { getAuth, signInWithPopup, signOut, User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const auth = getAuth()

interface IAuthContext {
  user?: User | null
  setUser: SetState<User | null | undefined>
  loading: boolean
  setLoading: SetState<boolean>
  shouldRedirect: boolean
  setShouldRedirect: SetState<boolean>
}

const AuthContext = createContext({} as IAuthContext)

export const AuthProvider: ComponentWithChildren = ({ children }) => {
  const [user, setUser] = useStoredState<User>('auth-user')
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (initialized) return
    if (user === undefined) setLoading(true)
    else {
      setLoading(false)
      setInitialized(true)
    }
  }, [initialized, user])

  useEffect(() => {
    if (shouldRedirect) {
      if (user) {
        navigate('/lists')
      } else {
        navigate('/')
      }

      setShouldRedirect(false)
    }
  }, [navigate, shouldRedirect, user])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setLoading,
        loading,
        shouldRedirect,
        setShouldRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

interface AuthHook
  extends Omit<
    IAuthContext,
    'setUser' | 'shouldRedirect' | 'setShouldRedirect'
  > {
  login: () => Promise<void>
  logout: () => Promise<void>
}
export function useAuth(secure: true): Omit<AuthHook, 'user'> & {
  user: User
}
export function useAuth(secure?: false): AuthHook

export function useAuth(secure?: boolean): AuthHook {
  const { setUser, user, loading, setLoading, setShouldRedirect } =
    useContext(AuthContext)

  const login = async () => {
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, firebaseAuthProvider)
      setUser(result.user)
      setShouldRedirect(true)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setShouldRedirect(true)
  }

  return {
    login,
    user,
    loading,
    setLoading,
    logout,
  }
}
