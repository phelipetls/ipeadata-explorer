import clsx from 'clsx'
import type { ReactNode } from 'react'

type Size = 'small' | 'medium'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  children: ReactNode
  isSelected: boolean
  size: Size
}

export function FilterButton({
  size,
  children,
  className,
  isSelected,
  ...rest
}: Props) {
  return (
    <button
      {...(isSelected && { 'data-selected': '' })}
      className={clsx(
        size === 'small' && 'text-sm px-2 py-1 rounded-lg',
        size === 'medium' && 'text-md px-4 py-2 rounded-full',
        'text-text-secondary',
        'bg-filter data-selected:bg-filter-selected',
        'hover:bg-filter-hover data-selected:hover:bg-filter-selected-hover',
        'active:bg-filter-active data-selected:active:bg-filter-selected-active',
        'data-selected:font-bold data-selected:text-accent',
        'transition-colors ease-in duration-300',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
