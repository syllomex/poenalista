import { Dispatch, ReactNode, SetStateAction } from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type ComponentWithChildren<P = unknown, C = ReactNode> = (
  props: P & { children: C }
) => JSX.Element | null

export type PropsWithChildren<P = unknown, C = ReactNode> = P & { children: C }

export type PropsWithOptionalChildren<P = unknown, C = ReactNode> = P & {
  children?: C
}
