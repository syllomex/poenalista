import { PropsWithChildren } from '@/types'
import line from '@/assets/icons/line.svg'
import arrowBack from '@/assets/icons/arrow-back.svg'
import { IconButton } from '@/components/IconButton'

export interface HeaderProps {
  canGoBack?: boolean
}

export function Header({
  children,
  canGoBack,
}: PropsWithChildren<HeaderProps>) {
  return (
    <div className="py-2 md:py-4">
      <div className="flex-row items-center">
        {canGoBack && (
          <IconButton
            icon={arrowBack}
            onClick={() => {
              window.history.back()
              console.log(window.history.length)
            }}
          />
        )}
        <p className="text-center pb-2 text-lg md:text-2xl flex-1">
          {children}
        </p>
        {canGoBack && <div className="w-6 h-6" />}
      </div>
      <img src={line} />
    </div>
  )
}
