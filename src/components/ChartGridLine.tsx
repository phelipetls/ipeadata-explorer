import clsx from 'clsx'
import { useChartContext } from '../context/ChartContext'

type Props = React.ComponentPropsWithoutRef<'line'>

export function ChartGridLine({ children, className, ...rest }: Props) {
  const { width, marginLeft, marginRight } = useChartContext()

  return (
    <line
      strokeWidth={1}
      className={clsx('stroke-chart-grid-line', className)}
      x1={0}
      x2={width - marginLeft - marginRight}
      y1={0}
      y2={0}
      {...rest}
    >
      {children}
    </line>
  )
}
