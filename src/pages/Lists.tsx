import { Authorized } from '@/components/Authorized'
import { Collection } from '@/components/Collection'
import { ListItem } from '@/components/ListItem'
import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List } from '@/types'

import { addDoc, collection, orderBy } from 'firebase/firestore'
import { useCallback, useMemo } from 'react'
import { Outlet } from 'react-router-dom'

function Component() {
  const { user, logout } = useAuth(true)

  const path = useMemo(() => `/users/${user.uid}/lists`, [user.uid])

  const handleCreateList = useCallback(() => {
    const text = prompt('nome da lista')
    if (!text) return

    void addDoc(collection(firestore, path), {
      name: text,
      createdAt: Date.now(),
    })
  }, [path])

  return (
    <div>
      <button onClick={handleCreateList}>Nova lista</button>
      <button onClick={logout}>Sair</button>

      <Collection<List>
        path={path}
        queryConstraints={[orderBy('createdAt', 'desc')]}
      >
        {data => (
          <div>
            {!data && <p>Carregando listas</p>}

            {data?.map(list => (
              <ListItem key={list.id} data={list} />
            ))}
          </div>
        )}
      </Collection>

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
