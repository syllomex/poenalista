import checkbox from '@/assets/icons/checkbox.svg'
import checkboxChecked from '@/assets/icons/checkbox-checked.svg'
import { useCallback, useEffect, useState } from 'react'

export interface CheckboxProps {
  label?: string
  checked?: boolean
  onChange?: (value: boolean) => unknown | Promise<unknown>
}

export function Checkbox({
  checked: _checked,
  label,
  onChange,
}: CheckboxProps) {
  const [checked, setChecked] = useState(_checked ?? false)

  useEffect(() => {
    if (typeof _checked === 'boolean') {
      setChecked(_checked)
    }
  }, [_checked])

  const handleChange = useCallback(() => {
    const value = !checked
    setChecked(value)
    onChange?.(value)
  }, [checked, onChange])

  return (
    <div
      className="flex-row py-2 cursor-pointer hover:opacity-80 transition-all"
      onClick={handleChange}
    >
      <img src={checked ? checkboxChecked : checkbox} />
      {!!label && <p className="pl-4 flex-1 md:text-xl">{label}</p>}
    </div>
  )
}
