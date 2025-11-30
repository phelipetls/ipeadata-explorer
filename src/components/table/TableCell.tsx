import React from 'react'
import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  className?: string
}

export function TableCell({ children, className }: Props) {
  return (
    <td className={clsx('px-4 w-min whitespace-nowrap', className)}>
      {children}
    </td>
  )
}
