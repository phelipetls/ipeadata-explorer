import { type ComponentPropsWithRef } from 'react'
import { useChartContext } from '../context/ChartContext'

type ChartCanvasProps = ComponentPropsWithRef<'canvas'>

export function ChartCanvas({ style, ...props }: ChartCanvasProps) {
  const { width, height } = useChartContext()
  return (
    <canvas
      width={width}
      height={height}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}
