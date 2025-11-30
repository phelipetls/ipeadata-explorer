import clsx from 'clsx'
import type { ReactNode } from 'react'

interface HomeSeriesListProps {
  children: ReactNode
  className?: string
}

export function HomeSeriesList({ children, className }: HomeSeriesListProps) {
  return (
    <div className={clsx('flex flex-row gap-2', className)}>{children}</div>
  )
}
