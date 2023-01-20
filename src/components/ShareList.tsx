import { Authorized } from '@/components/Authorized'
import { useAuth } from '@/providers/auth'
import { firestore } from '@/services'
import { Share } from '@/types'
import { useAsyncAction, useAsyncHandler } from '@/utils'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { useCallback, useMemo } from 'react'
import { Document } from './Document'

function SharingWithEmail({
  email,
  onDelete,
}: {
  email: string
  onDelete: (email: string) => Promise<void>
}) {
  return (
    <div>
      {email} -{' '}
      <button
        onClick={() => {
          void onDelete(email)
        }}
      >
        Excluir
      </button>
    </div>
  )
}

function List({ data, path }: { data: Share; path: string }) {
  const { user } = useAuth(true)

  const [handleShare] = useAsyncAction(async () => {
    const email = prompt('Digite o e-mail')
    if (!email) return
    if (email === user.email) {
      alert('Você não pode compartilhar sua lista com você mesmo!')
      return
    }

    if (data.with.includes(email)) {
      alert(
        'Você já está compartilhando suas listas com esse endereço de e-mail!'
      )
      return
    }
    await setDoc(doc(collection(firestore, path), user.uid), {
      with: [...data.with, email],
      createdAt: Date.now(),
    } as Omit<Share, 'id'>)
  }, [path])

  const [handleDelete] = useAsyncHandler(
    useCallback(
      async (email: string) => {
        const updated = [...data.with]
        updated.splice(updated.indexOf(email), 1)
        await updateDoc(doc(firestore, `${path}/${user.uid}`), {
          with: updated,
        })
      },
      [data.with, path, user.uid]
    )
  )

  return (
    <div>
      <div>Compartilhando com</div>
      <button onClick={handleShare}>Adicionar</button>
      {data.with.map(email => (
        <SharingWithEmail key={email} email={email} onDelete={handleDelete} />
      ))}
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
