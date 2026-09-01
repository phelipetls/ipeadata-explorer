import clsx from 'clsx'
import { useChartContext } from '../context/ChartContext'

type Props = React.ComponentPropsWithRef<'text'>

export function ChartYAxisLabel({ children, className, ...rest }: Props) {
  const { height } = useChartContext()

  return (
    <text
      className={clsx('text-sm', className)}
      transform='rotate(-90)'
      y={0}
      dy='1em'
      x={-(height / 2)}
      textAnchor='middle'
      {...rest}
    >
      {children}
    </text>
  )
}
