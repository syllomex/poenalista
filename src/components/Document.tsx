import { firestore } from '@/services'
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  onSnapshot,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function Document<T = unknown>({
  path,
  children,
  defaultValue,
}: {
  path: string
  children?: (
    data: (T & { id: string }) | undefined | null,
    error?: FirestoreError
  ) => JSX.Element
  defaultValue?: T & { id: string }
}) {
  const docRef = useMemo(() => doc(firestore, path), [path])

  const [data, setData] = useState<(T & { id: string }) | null>()
  const [error, setError] = useState<FirestoreError>()

  const format = useCallback((doc: DocumentSnapshot<DocumentData>) => {
    return { id: doc.id, ...doc.data() } as T & { id: string }
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(
      docRef,
      snapshot => {
        setData(format(snapshot))
      },
      error => {
        setError(error)
        if (defaultValue) setData(defaultValue)
        console.error(`Document: ${path} > ${error.message}`)
      }
    )

    return unsub
  }, [defaultValue, docRef, format, path])

  return children?.(data, error) ?? null
}
