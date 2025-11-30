import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: ReactNode
}

export function ChartTooltipPortal({ children }: Props) {
  return createPortal(children, document.getElementById('root')!)
}
