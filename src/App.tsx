import { Lists } from './pages/Lists'
import { AuthProvider, useAuth } from './providers/auth'

function Component() {
  const { user, login, loading } = useAuth()

  if (user) return <Lists />

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

function App() {
  return (
    <AuthProvider>
      <Component />
    </AuthProvider>
  )
}

export default App
