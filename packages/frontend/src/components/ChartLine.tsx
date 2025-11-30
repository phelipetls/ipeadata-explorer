import type { ComponentPropsWithoutRef } from 'react'

type ChartLineProps = ComponentPropsWithoutRef<'path'>

export function ChartLine({ strokeWidth = 2, ...rest }: ChartLineProps) {
  return <path fill='none' strokeWidth={strokeWidth} {...rest} />
}
