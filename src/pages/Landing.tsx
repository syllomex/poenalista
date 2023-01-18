import { useAuth } from '@/providers/auth'

export function Landing() {
  const { user, login, loading } = useAuth()

  return (
    <div>
      {loading ? (
        <h1>Carregando</h1>
      ) : (
        <>
          {user ? (
            <pre>{JSON.stringify(user, null, 2)}</pre>
          ) : (
            <button onClick={login}>Login</button>
          )}
        </>
      )}
    </div>
  )
}
