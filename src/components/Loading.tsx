import { DotLoader } from 'react-spinners'
import { LengthType } from 'react-spinners/helpers/props'

export interface LoadingProps {
  size?: LengthType
  className?: string
}

export function Loading({ size, className }: LoadingProps) {
  return <DotLoader color="#FFFFFF" size={size} className={className} />
}
