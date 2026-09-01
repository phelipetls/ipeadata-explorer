import clsx from 'clsx'
import React from 'react'

type Props = React.ComponentPropsWithRef<'div'>

export function TableContainer({ children, className, ...rest }: Props) {
  return (
    <div className={clsx('', className)} {...rest}>
      {children}
    </div>
  )
}
