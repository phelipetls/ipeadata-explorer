import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props extends React.ComponentPropsWithRef<'button'> {
  isSelected: boolean
  children: ReactNode
}

export function SegmentGroupItem({ isSelected, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'appearance-none',
        'bg-surface-secondary',
        'px-3 py-1',
        'text-sm',
        isSelected
          ? 'bg-surface-tertiary font-medium shadow-sm'
          : 'text-text-secondary',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
