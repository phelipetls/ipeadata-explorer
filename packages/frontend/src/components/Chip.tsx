import clsx from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = React.ComponentPropsWithRef<'button'> & {
  isActive: boolean
}

export const Chip = ({
  children,
  onClick,
  disabled = false,
  className = '',
  isActive,
  ...rest
}: Props) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        clsx(
          'inline-flex whitespace-nowrap items-center px-3 py-1.5 rounded-full text-sm transition-colors duration-150 ease-in-out shadow-xs border-1 border-outline',
          disabled
            ? 'bg-chip-disabled text-text-disabled cursor-not-allowed'
            : isActive
              ? 'bg-chip-selected text-text-primary hover:bg-chip-selected-hover active:bg-chip-selected-active'
              : 'bg-chip text-text-secondary hover:bg-chip-hover active:bg-chip-active',
          className,
        ),
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
