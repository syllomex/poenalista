import { Collection } from '@/components/Collection'
import { firestore } from '@/services'
import { addDoc, collection } from 'firebase/firestore'
import { useCallback } from 'react'

interface List {
  id: string
  name: string
}

export function Lists() {
  const handleCreateList = useCallback(() => {
    const text = prompt('nome da lista')
    if (!text) return

    void addDoc(collection(firestore, 'lists'), { name: text })
  }, [])

  return (
    <div>
      <button onClick={handleCreateList}>Nova lista</button>

      <Collection<List> path="lists">
        {data => <pre>{JSON.stringify(data, null, 2)}</pre>}
      </Collection>
    </div>
  )
}
