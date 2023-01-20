import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List } from '@/types'
import { useAsyncAction } from '@/utils'

import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

export interface ListItemProps {
  data: List
}

export function ListItem({ data }: ListItemProps) {
  const { user } = useAuth(true)

  const [handleUpdate, { loading: updating }] = useAsyncAction(async () => {
    const newName = prompt('Digite o novo nome', data.name)
    if (!newName?.length) return
    await updateDoc(doc(firestore, `/lists/${data.id}`), {
      name: newName,
    })
  }, [data.id, data.name, user.uid])

  const [handleDelete, { loading: deleting }] = useAsyncAction(async () => {
    await deleteDoc(doc(firestore, `/lists/${data.id}`))
  }, [user.uid, data.id])

  return (
    <div>
      <div>
        <div>
          <Link to={`/lists/${data.id}`}>{data.name}</Link>
        </div>
        <div>
          {updating ? (
            'Salvando'
          ) : (
            <button onClick={handleUpdate}>Editar</button>
          )}

          {data.ownerId === user.uid && (
            <>
              {deleting ? (
                'Excluindo'
              ) : (
                <button onClick={handleDelete}>Excluir</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
