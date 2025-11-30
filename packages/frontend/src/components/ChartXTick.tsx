import type { ReactNode } from 'react'
import { ChartTick } from './ChartTick'

interface Props {
  children: ReactNode
  size: number
  gap: number
}

export function ChartXTick({ children, size, gap }: Props) {
  return (
    <>
      <line className='stroke-current' y2={size}>
        {children}
      </line>

      <ChartTick y={size + gap} textAnchor='middle'>
        {children}
      </ChartTick>
    </>
  )
}
