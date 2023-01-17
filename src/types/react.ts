import { Dispatch, ReactNode, SetStateAction } from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type ComponentWithChildren<P = unknown, C = ReactNode> = (
  props: P & { children: C }
) => JSX.Element | null
