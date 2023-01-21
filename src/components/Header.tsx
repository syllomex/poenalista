import arrowBack from '@/assets/icons/arrow-back.svg'
import line from '@/assets/icons/line.svg'
import profile from '@/assets/icons/profile.svg'
import { IconButton } from '@/components/IconButton'
import { PropsWithChildren } from '@/types'
import { Link } from 'react-router-dom'

export interface HeaderProps {
  canGoBack?: boolean
  hideProfile?: boolean
}

export function Header({
  children,
  canGoBack,
  hideProfile,
}: PropsWithChildren<HeaderProps>) {
  return (
    <div className="py-2 md:py-4">
      <div className="flex-row items-center">
        {canGoBack ? (
          <IconButton
            icon={arrowBack}
            onClick={() => {
              window.history.back()
            }}
          />
        ) : (
          <div className="w-8 h-6" />
        )}

        <p className="text-center pb-2 text-lg md:text-2xl flex-1">
          {children}
        </p>

        {!hideProfile ? (
          <div className="w-8 h-6 items-center justify-center">
            <Link to="/profile">
              <img src={profile} />
            </Link>
          </div>
        ) : (
          <div className="w-8 h-6" />
        )}
      </div>
      <img src={line} />
    </div>
  )
}
