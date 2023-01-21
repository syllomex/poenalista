import { PropsWithChildren } from '@/types'

export interface ButtonProps {
  onClick?: () => Promise<unknown> | unknown
  icon?: string
}

export function Button({
  onClick,
  icon,
  children,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      onClick={onClick}
      className="flex items-center py-4 hover:opacity-80 transition-all"
    >
      {!!icon && <img src={icon} className="h-4 w-4 md:h-6 md:w-6" />}
      <span className="pl-4 md:text-xl">{children}</span>
    </button>
  )
}
