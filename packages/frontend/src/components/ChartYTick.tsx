import type { ReactNode } from 'react'
import { ChartTick } from './ChartTick'

interface Props extends React.ComponentPropsWithRef<'g'> {
  children: ReactNode
  size: number
  gap: number
}

export function ChartYTick({ children, size, gap, ...rest }: Props) {
  return (
    <g {...rest}>
      <line className='stroke-current' x2={-size}>
        {children}
      </line>

      <ChartTick x={-(size + gap)} textAnchor='end' alignmentBaseline='middle'>
        {children}
      </ChartTick>
    </g>
  )
}
