import { Authorized } from '@/components/Authorized'
import { Header } from '@/components/Header'
import { ShareList } from '@/components/ShareList'
import { useAuth } from '@/providers/auth'
import { useCallback } from 'react'

function Component() {
  const { user, logout } = useAuth(true)

  const handleLogout = useCallback(() => {
    const confirmed = confirm('Sair da sua conta?')
    if (!confirmed) return
    void logout()
  }, [logout])

  return (
    <div>
      <Header canGoBack hideProfile>
        Meu perfil
      </Header>

      <div className="block overflow-y-auto flex-1">
        <div className="flex-row mt-4">
          {!!user.photoURL && (
            <img
              src={user.photoURL}
              referrerPolicy="no-referrer"
              className="w-16 h-16 md:w-24 md:h-24 rounded-full"
            />
          )}
          <div className="ml-4 flex-1">
            <p>{user.displayName}</p>
            <p>{user.email}</p>
            <p
              onClick={handleLogout}
              className="text-danger text-sm cursor-pointer hover:opacity-80 mt-2"
            >
              Sair
            </p>
          </div>
        </div>

        <ShareList />
      </div>
    </div>
  )
}

export function Profile() {
  return (
    <Authorized>
      <Component />
    </Authorized>
  )
}
