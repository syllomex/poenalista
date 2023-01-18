import { Collection } from '@/components/Collection'
import { ListItem } from '@/components/ListItem'
import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List } from '@/types'
import { addDoc, collection } from 'firebase/firestore'
import { useCallback, useMemo } from 'react'

export function Lists() {
  const { user } = useAuth(true)

  const path = useMemo(() => `/users/${user.uid}/lists`, [user.uid])

  const handleCreateList = useCallback(() => {
    const text = prompt('nome da lista')
    if (!text) return

    void addDoc(collection(firestore, path), { name: text })
  }, [path])

  return (
    <div>
      <button onClick={handleCreateList}>Nova lista</button>

      <Collection<List> path={path}>
        {data => (
          <div>
            {!data && <p>Carregando listas</p>}

            {data?.map(list => (
              <ListItem key={list.id} data={list} />
            ))}
          </div>
        )}
      </Collection>
    </div>
  )
}
