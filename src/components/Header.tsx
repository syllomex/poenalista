import { PropsWithChildren } from '@/types'
import line from '@/assets/icons/line.svg'

export function Header({ children }: PropsWithChildren) {
  return (
    <div className="py-2 md:py-4">
      <p className="text-center pb-2 text-lg md:text-2xl">{children}</p>
      <img src={line} />
    </div>
  )
}
