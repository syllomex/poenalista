import { Authorized } from '@/components/Authorized'
import { Collection } from '@/components/Collection'
import { firestore } from '@/services'
import { ListItem } from '@/types'
import { useAsyncAction, useAsyncHandler } from '@/utils'

import { addDoc, collection, doc, orderBy, updateDoc } from 'firebase/firestore'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <input
          id={`item-${data.id}`}
          type="checkbox"
          checked={data.checked}
          onChange={handleToggleChecked}
        />
        <label
          htmlFor={`item-${data.id}`}
          style={{ display: 'block', flex: 1 }}
        >
          {data.name}
        </label>
      </div>
      <button onClick={handleUpdate}>Editar</button>
    </div>
  )
}

function Component() {
  const navigate = useNavigate()
  const params = useParams<{ listId: string }>()
  const path = `/lists/${params.listId as string}/items`

  const [handleAddItem, { loading: creating }] = useAsyncAction(async () => {
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
      <hr />
      <button onClick={handleAddItem} disabled={creating}>
        Adicionar item
      </button>
      <Collection<ListItem>
        path={path}
        queryConstraints={[orderBy('createdAt', 'asc')]}
      >
        {data => (
          <div>
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
