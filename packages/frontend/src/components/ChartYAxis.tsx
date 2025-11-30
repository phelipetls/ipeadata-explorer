import { useChartContext } from '../context/ChartContext'

type Props = React.ComponentPropsWithRef<'g'>

export function ChartYAxis({ ref, children, ...rest }: Props) {
  const { marginLeft, marginTop, height, marginBottom } = useChartContext()

  return (
    <g ref={ref} transform={`translate(${marginLeft},0)`} {...rest}>
      <line y1={marginTop} y2={height - marginBottom} stroke='currentColor' />
      {children}
    </g>
  )
}
