import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List } from '@/types'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { DependencyList, useCallback, useEffect, useState } from 'react'

export interface ListItemProps {
  data: List
}

const useAsyncAction = (
  handler: () => Promise<unknown>,
  deps: DependencyList
) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await handler()
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps])

  useEffect(() => {
    console.log('deps changed')
  }, [deps])

  return [execute, { loading, error }] as const
}

export function ListItem({ data }: ListItemProps) {
  const { user } = useAuth(true)

  const [handleUpdate, { loading: updating }] = useAsyncAction(async () => {
    const newName = prompt('Digite o novo nome', data.name)
    if (!newName?.length) return
    await updateDoc(doc(firestore, `/users/${user.uid}/lists/${data.id}`), {
      name: newName,
    })
  }, [data.id, data.name, user.uid])

  const [handleDelete, { loading: deleting }] = useAsyncAction(async () => {
    await deleteDoc(doc(firestore, `/users/${user.uid}/lists/${data.id}`))
  }, [user.uid, data.id])

  return (
    <div>
      <p>
        {data.name}{' '}
        {updating ? 'Salvando' : <button onClick={handleUpdate}>Editar</button>}
        {deleting ? 'Excluindo' : <button onClick={handleDelete}>Excluir</button>}
      </p>
    </div>
  )
}
