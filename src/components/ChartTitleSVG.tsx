import React from 'react'
import { useChartContext } from '../context/ChartContext'
import { ChartTitle } from './ChartTitle'

interface Props
  extends Omit<React.ComponentPropsWithRef<'foreignObject'>, 'children'> {
  children: string
}

export function ChartTitleSVG({ ref, children, ...rest }: Props) {
  const { width, marginLeft, marginRight } = useChartContext()

  const maxWidth = width - marginLeft - marginRight

  return (
    <foreignObject
      ref={ref}
      x={marginLeft}
      y={0}
      width={maxWidth}
      height={20}
      {...rest}
    >
      <ChartTitle>{children}</ChartTitle>
    </foreignObject>
  )
}
