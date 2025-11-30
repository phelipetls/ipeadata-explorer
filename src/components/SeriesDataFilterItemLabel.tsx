import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function SeriesDataFilterItemLabel({ children }: Props) {
  return <span className='text-xs text-text-secondary'>{children}</span>
}
