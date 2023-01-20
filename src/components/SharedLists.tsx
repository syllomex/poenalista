import { Authorized } from '@/components/Authorized'
import { Collection } from '@/components/Collection'
import { useAuth } from '@/providers/auth'
import { Share } from '@/types'
import { where } from 'firebase/firestore'
import { useMemo } from 'react'

function Component() {
  const { user } = useAuth(true)

  const sharedPath = useMemo(() => '/share', [])

  return (
    <Collection<Share>
      path={sharedPath}
      queryConstraints={[where('shareWith', '==', user.email)]}
    >
      {data => (
        <div>
          {!data && <p>Carregando compartilhados comigo</p>}
          {!!data && (
            <div>
              Compartilhados comigo
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </Collection>
  )
}

export function SharedLists() {
  return (
    <Authorized>
      <Component />
    </Authorized>
  )
}
