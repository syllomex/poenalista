import plus from '@/assets/icons/plus.svg'
import { Authorized } from '@/components/Authorized'
import { Button } from '@/components/Button'
import { Collection } from '@/components/Collection'
import { Header } from '@/components/Header'
import { firestore } from '@/services'
import { ListItem } from '@/types'
import { useAsyncAction, useAsyncHandler } from '@/utils'

import { Checkbox } from '@/components/Checkbox'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
} from 'firebase/firestore'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import edit from '@/assets/icons/edit.svg'
import trash from '@/assets/icons/trash.svg'
import { IconButton } from '@/components/IconButton'

function Item({ data, listId }: { data: ListItem; listId: string }) {
  const path = `/lists/${listId}/items/${data.id}`

  const [handleToggleChecked] = useAsyncAction(async () => {
    await updateDoc(doc(firestore, path), { checked: !data.checked })
  }, [])

  const [handleUpdate] = useAsyncHandler(
    useCallback(async () => {
      const newName = prompt('Digite o novo nome', data.name)
      if (!newName) return
      await updateDoc(doc(firestore, path), { name: newName })
    }, [data.name, path])
  )

  const [handleDelete] = useAsyncHandler(
    useCallback(async () => {
      const confirmed = confirm('Excluir item?')
      if (!confirmed) return
      await deleteDoc(doc(firestore, path))
    }, [path])
  )

  return (
    <div className="flex-row">
      <div className="flex-1">
        <Checkbox
          label={data.name}
          onChange={handleToggleChecked}
          checked={data.checked}
        />
      </div>
      <div className="flex-row gap-1">
        <IconButton icon={edit} onClick={handleUpdate} />
        <IconButton icon={trash} onClick={handleDelete} />
      </div>
    </div>
  )
}

function Component() {
  const navigate = useNavigate()
  const params = useParams<{ listId: string }>()
  const path = `/lists/${params.listId as string}/items`

  const [handleAddItem] = useAsyncAction(async () => {
    const name = prompt('Digite o nome do item')
    if (!name) return
    const data: Omit<ListItem, 'id'> = {
      name,
      createdAt: Date.now(),
      checked: false,
    }
    await addDoc(collection(firestore, path), data)
  }, [path])

  if (!params.listId) {
    navigate('/lists')
    return null
  }

  return (
    <div>
      <Header canGoBack>Lista</Header>

      <Button icon={plus} onClick={handleAddItem}>
        Novo item
      </Button>
      <Collection<ListItem>
        path={path}
        queryConstraints={[orderBy('createdAt', 'asc')]}
      >
        {data => (
          <div className="overflow-y-auto flex-1 block">
            {data?.map(item => (
              <Item
                key={item.id}
                data={item}
                listId={params.listId as string}
              />
            ))}
          </div>
        )}
      </Collection>
    </div>
  )
}

export function Items() {
  return (
    <Authorized>
      <Component />
    </Authorized>
  )
}
