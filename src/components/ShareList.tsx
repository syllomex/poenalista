import { Authorized } from '@/components/Authorized'
import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { Share } from '@/types'
import { useAsyncAction } from '@/utils'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useMemo } from 'react'
import { Document } from './Document'

function List({ data, path }: { data: Share; path: string }) {
  const { user } = useAuth(true)

  const [handleShare] = useAsyncAction(async () => {
    const email = prompt('Digite o e-mail')
    if (!email) return
    await setDoc(doc(collection(firestore, path), user.uid), {
      with: [...data.with, email],
      createdAt: Date.now(),
    } as Omit<Share, 'id'>)
  }, [path])

  return (
    <div>
      <div>Compartilhando com</div>
      <button onClick={handleShare}>Adicionar</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

function Component() {
  const { user } = useAuth(true)

  const path = useMemo(() => '/share', [])
  console.log(path)

  return (
    <Document<Share>
      path={`${path}/${user.uid}`}
      defaultValue={{ id: user.uid, with: [] }}
      createOnError
    >
      {data => <>{!!data && <List data={data} path={path} />}</>}
    </Document>
  )
}

export function ShareList() {
  return (
    <Authorized>
      <Component />
    </Authorized>
  )
}
