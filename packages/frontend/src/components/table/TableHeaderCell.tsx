import React from 'react'
import clsx from 'clsx'

interface Props extends React.ComponentPropsWithRef<'th'> {
  children: React.ReactNode
  className?: string
}

export function TableHeaderCell({ children, className, ...rest }: Props) {
  return (
    <th
      className={clsx(
        'truncate',
        'px-4',
        'text-table-head-text font-semibold text-left',
        'bg-table-head',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  )
}
