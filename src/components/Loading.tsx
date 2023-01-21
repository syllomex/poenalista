import { DotLoader } from 'react-spinners'
import { LengthType } from 'react-spinners/helpers/props'

export interface LoadingProps {
  size?: LengthType
}

export function Loading({ size }: LoadingProps) {
  return <DotLoader color="#FFFFFF" size={size} />
}
