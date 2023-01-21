export interface IconButtonProps {
  icon: string
  onClick?: () => unknown | Promise<unknown>
}

export function IconButton({ icon, onClick }: IconButtonProps) {
  return (
    <button onClick={onClick} className="px-2 py-2">
      <img src={icon} className="md:h-6 md:w-6" />
    </button>
  )
}
