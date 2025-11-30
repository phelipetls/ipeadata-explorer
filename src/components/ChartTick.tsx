import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props extends React.ComponentPropsWithoutRef<'text'> {
  children: ReactNode
}

export function ChartTick({ children, className, ...rest }: Props) {
  return (
    <text className={clsx('text-xs', className)} {...rest}>
      {children}
    </text>
  )
}
