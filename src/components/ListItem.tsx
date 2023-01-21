import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { List } from '@/types'
import { useAsyncAction } from '@/utils'

import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

import itemMark from '@/assets/icons/item-mark.svg'
import trash from '@/assets/icons/trash.svg'
import edit from '@/assets/icons/edit.svg'

export interface ListItemProps {
  data: List
}

export function ListItem({ data }: ListItemProps) {
  const { user } = useAuth(true)

  const [handleUpdate] = useAsyncAction(async () => {
    const newName = prompt('Digite o novo nome', data.name)
    if (!newName?.length) return
    await updateDoc(doc(firestore, `/lists/${data.id}`), {
      name: newName,
    })
  }, [data.id, data.name, user.uid])

  const [handleDelete] = useAsyncAction(async () => {
    const confirmed = confirm('Excluir lista?')
    if (!confirmed) return
    await deleteDoc(doc(firestore, `/lists/${data.id}`))
  }, [user.uid, data.id])

  return (
    <div className="flex-row items-start">
      <Link
        to={`/lists/${data.id}`}
        className="flex flex-row flex-1 py-2 items-start"
      >
        <img src={itemMark} className="object-none md:h-6 md:w-6" />
        <p className="pl-4 flex-1 md:text-xl">{data.name}</p>
      </Link>
      {data.ownerId === user.uid && (
        <div className="pt-2 flex-row">
          <button onClick={handleUpdate} className="px-2 mr-2 py-1">
            <img src={edit} className="md:h-6 md:w-6" />
          </button>
          <button onClick={handleDelete} className="px-2 py-1">
            <img src={trash} className="md:h-6 md:w-6" />
          </button>
        </div>
      )}
    </div>
  )
}
