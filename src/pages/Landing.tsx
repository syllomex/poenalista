import { useAuth } from '@/providers/auth'
import logo from '@/assets/logo.svg'

import { DotLoader } from 'react-spinners'

export function Landing() {
  const { login, loading } = useAuth()

  return (
    <div className="flex-1 items-center justify-around">
      <img src={logo} className="w-[50%] max-w-sm" />
      {loading ? (
        <DotLoader color="#ffffff" />
      ) : (
        <>
          <button
            onClick={login}
            className="underline underline-offset-4 md:text-2xl"
          >
            Entrar com google
          </button>
        </>
      )}
    </div>
  )
}
