import { Authorized } from '@/components/Authorized'
import { Collection } from '@/components/Collection'
import { ListItem } from '@/components/ListItem'
import { Loading } from '@/components/Loading'
import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List, Share } from '@/types'
import { useAsyncHandler } from '@/utils'

import { addDoc, collection, orderBy, where } from 'firebase/firestore'
import { useCallback, useMemo } from 'react'

import plus from '@/assets/icons/plus.svg'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'

function Component() {
  const { user } = useAuth(true)

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
      <Header>Listas</Header>

      <div>
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
                {!data && (
                  <div className="items-center py-4">
                    <Loading size={20} />
                  </div>
                )}

                {!!data && (
                  <div>
                    <Button icon={plus} onClick={handleCreateList}>
                      Nova lista
                    </Button>

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
                        <div className="overflow-y-auto block flex-1">
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
      </div>
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
