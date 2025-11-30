import * as d3 from 'd3'
import { useState } from 'react'

type MousePointerCoords = { x: number; y: number }

type OwnProps = {
  children:
    | React.ReactNode
    | ((coords: MousePointerCoords | null) => React.ReactNode)
  onPointerChange: (coords: MousePointerCoords) => void
}

type Props = OwnProps & Omit<React.ComponentPropsWithRef<'div'>, keyof OwnProps>

export function MousePointerTracker({
  children,
  onPointerChange,
  onMouseMove,
  ...rest
}: Props) {
  const [pointer, setPointer] = useState<MousePointerCoords | null>(null)

  return (
    <div
      onMouseMove={(e, ...rest) => {
        onMouseMove?.(e, ...rest)

        const pointer = d3.pointer(e)

        const value = {
          x: pointer[0],
          y: pointer[1],
        }

        setPointer(value)
        onPointerChange(value)
      }}
      {...rest}
    >
      {typeof children === 'function' ? children(pointer) : children}
    </div>
  )
}
