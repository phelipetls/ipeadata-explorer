import type { ReactNode } from 'react'
import { useChartContext } from '../context/ChartContext'

interface Props {
  children: ReactNode
}

export function ChartXAxis({ children }: Props) {
  const { width, height, marginBottom, marginLeft, marginRight } =
    useChartContext()

  return (
    <g transform={`translate(0,${height - marginBottom})`}>
      <line x1={marginLeft} x2={width - marginRight} stroke='currentColor' />
      {children}
    </g>
  )
}
