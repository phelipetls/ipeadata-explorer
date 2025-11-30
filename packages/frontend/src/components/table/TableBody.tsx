import React from 'react'
import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  className?: string
}

export function TableBody({ children, className }: Props) {
  return (
    <tbody
      className={clsx(
        '[&_tr]:bg-table-row [&_tr]:odd:bg-table-row-odd',
        className,
      )}
    >
      {children}
    </tbody>
  )
}
