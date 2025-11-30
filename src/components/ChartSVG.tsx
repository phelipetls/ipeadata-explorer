import { useChartContext } from '../context/ChartContext'

type Props = React.ComponentPropsWithRef<'svg'>

export function ChartSVG({ children, ...rest }: Props) {
  const { width, height } = useChartContext()

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      {...rest}
    >
      {children}
    </svg>
  )
}
