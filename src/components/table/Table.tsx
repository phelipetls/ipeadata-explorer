import React from 'react'
import clsx from 'clsx'

interface Props extends React.ComponentPropsWithoutRef<'table'> {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className, ...rest }: Props) {
  return (
    <table
      className={clsx(
        'table-auto border-separate border-spacing-0 w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </table>
  )
}
