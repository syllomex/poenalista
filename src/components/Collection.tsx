import { firestore } from '@/services'
import {
  collection,
  DocumentData,
  FirestoreError,
  onSnapshot,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function Collection<T = unknown>({
  path,
  queryConstraints,
  children,
  defaultValue,
}: {
  path: string
  queryConstraints?: QueryConstraint[]
  children?: (
    data: Array<T & { id: string }> | undefined | null,
    error?: FirestoreError
  ) => JSX.Element
  defaultValue?: Array<T & { id: string }>
}) {
  const ref = useMemo(() => collection(firestore, path), [path])
  const q = useMemo(
    () => query(ref, ...(queryConstraints ?? [])),
    [ref, queryConstraints]
  )

  const [data, setData] = useState<Array<T & { id: string }> | null>()
  const [error, setError] = useState<FirestoreError>()

  const format = useCallback((doc: QueryDocumentSnapshot<DocumentData>) => {
    return { id: doc.id, ...doc.data() } as T & { id: string }
  }, [])

  const update = useCallback(
    (doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = format(doc)
      setData(cur => {
        if (!cur) return cur
        const index = cur.findIndex(item => item.id === data.id)
        if (index === -1) return cur
        const updated = [
          ...[...cur].splice(0, index),
          data,
          ...[...cur].splice(index + 1),
        ]
        return updated
      })
    },
    [format]
  )

  useEffect(() => {
    const unsub = onSnapshot(
      q,
      snapshot => {
        setData(snapshot.docs.map(doc => format(doc)))

        snapshot.docChanges().forEach(change => {
          if (change.type === 'modified') update(change.doc)
        })
      },
      error => {
        if (defaultValue) setData(defaultValue)
        setError(error)
        console.error(`${path} > ${error.message}`)
      }
    )

    return unsub
  }, [defaultValue, format, path, q, update])

  return children?.(data, error) ?? null
}
