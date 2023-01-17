import { firestore } from '@/services'
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

export function Collection<T = unknown>({
  path,
  queryConstraints,
  children,
}: {
  path: string
  queryConstraints?: QueryConstraint[]
  children?: (data: T[] | undefined | null) => JSX.Element
}) {
  const listsRef = useMemo(() => collection(firestore, path), [path])
  const q = useMemo(
    () => query(listsRef, ...(queryConstraints ?? [])),
    [listsRef, queryConstraints]
  )

  const [data, setData] = useState<T[] | null>()

  useEffect(() => {
    const unsub = onSnapshot(q, doc => {
      // const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
      // console.log(source)
      setData(doc.docs.map(doc => ({ id: doc.id, ...doc.data() } as T)))
    })

    return unsub
  }, [path, q])

  return children?.(data) ?? null
}
