import { firestore } from '@/services'
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function Document<T = unknown>({
  path,
  children,
  defaultValue,
  createOnError,
}: {
  path: string
  children?: (
    data: (T & { id: string }) | undefined | null,
    error?: FirestoreError
  ) => JSX.Element
  defaultValue?: T & { id: string }
  createOnError?: boolean
}) {
  const docRef = useMemo(() => doc(firestore, path), [path])

  const [data, setData] = useState<(T & { id: string }) | null>()
  const [error, setError] = useState<FirestoreError>()
  const [refreshing, setRefreshing] = useState(false)

  const format = useCallback((doc: DocumentSnapshot<DocumentData>) => {
    return { id: doc.id, ...doc.data() } as T & { id: string }
  }, [])

  const refresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 100)
  }, [])

  useEffect(() => {
    if (refreshing) return

    const unsub = onSnapshot(
      docRef,
      snapshot => {
        setData(format(snapshot))
      },
      error => {
        setError(error)
        if (defaultValue) {
          setData(defaultValue)
          if (createOnError) {
            void setDoc(docRef, defaultValue, { merge: true }).then(() => {
              refresh()
            })
          }
        }
        console.error(`Document: ${path} > ${error.message}`)
      }
    )

    return unsub
  }, [createOnError, defaultValue, docRef, format, path, refresh, refreshing])

  return children?.(data, error) ?? null
}
