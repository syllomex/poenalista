import { Authorized } from '@/components/Authorized'
import { Collection } from '@/components/Collection'
import { ListItem } from '@/components/ListItem'
import { ShareList } from '@/components/ShareList'
import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List, Share } from '@/types'
import { useAsyncHandler } from '@/utils'

import { addDoc, collection, orderBy, where } from 'firebase/firestore'
import { useCallback, useMemo } from 'react'
import { Outlet } from 'react-router-dom'

function Component() {
  const { user, logout } = useAuth(true)

  const path = useMemo(() => '/lists', [])

  const [handleCreateList] = useAsyncHandler(
    useCallback(async () => {
      const text = prompt('nome da lista')
      if (!text) return

      void addDoc(collection(firestore, path), {
        name: text,
        createdAt: Date.now(),
        ownerId: user.uid,
      })
    }, [path, user.uid])
  )

  const sharedPath = useMemo(() => '/share', [])

  return (
    <div>
      <button onClick={handleCreateList}>Nova lista</button>
      <button onClick={logout}>Sair</button>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Collection<Share>
            path={sharedPath}
            queryConstraints={[
              where('with', 'array-contains-any', [user.email]),
            ]}
            defaultValue={[]}
          >
            {data => (
              <div>
                {!data && <p>Carregando compartilhados comigo</p>}
                {!!data && (
                  <div>
                    Compartilhados comigo
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    <Collection<List>
                      path={path}
                      queryConstraints={[
                        where('ownerId', 'in', [
                          user.uid,
                          ...data.map(share => share.id),
                        ]),
                        orderBy('createdAt', 'desc'),
                      ]}
                    >
                      {data => (
                        <div>
                          Listas:
                          {data?.map(list => (
                            <ListItem key={list.id} data={list} />
                          ))}
                        </div>
                      )}
                    </Collection>
                  </div>
                )}
              </div>
            )}
          </Collection>
        </div>

        <div style={{ flex: 1 }}>
          <ShareList />
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export function Lists() {
  return (
    <Authorized>
      <Component />
    </Authorized>
  )
}
