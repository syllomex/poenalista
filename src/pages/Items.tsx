import { Authorized } from '@/components/Authorized'
import { Collection } from '@/components/Collection'
import { firestore } from '@/services'
import { ListItem } from '@/types'
import { useAsyncAction } from '@/utils'

import { addDoc, collection, doc, orderBy, updateDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'

function Item({ data, listId }: { data: ListItem; listId: string }) {
  const path = `/lists/${listId}/items/${data.id}`

  const [handleToggleChecked] = useAsyncAction(async () => {
    await updateDoc(doc(firestore, path), { checked: !data.checked })
  }, [])

  return (
    <div>
      <div>
        <input
          type="checkbox"
          checked={data.checked}
          onChange={handleToggleChecked}
        />
        <span>{data.name}</span>
      </div>
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
