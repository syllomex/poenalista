import { useAuth } from '@/providers/auth'
import { Loading } from '@/components/Loading'
import logo from '@/assets/logo.svg'

export function Landing() {
  const { login, loading } = useAuth()

  return (
    <div className="flex-1 items-center justify-around">
      <img src={logo} className="w-[50%] max-w-sm" />
      {loading ? (
        <Loading />
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
