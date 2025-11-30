import {
  useFloating,
  shift,
  flip,
  offset,
  type Placement,
} from '@floating-ui/react'
import { useRef } from 'react'

interface WithGetBoundingClientRect {
  getBoundingClientRect(): DOMRect
}

export function useFloatingChartTooltip<
  TElementType extends WithGetBoundingClientRect,
>(options: { placement: Placement }) {
  const chartRef = useRef<TElementType | null>(null)

  const { refs, floatingStyles } = useFloating({
    placement: options.placement,
    middleware: [
      offset({
        mainAxis: 8,
      }),
      flip(),
      shift({ padding: 8 }),
    ],
  })

  const onUpdatedTooltipPosition = (
    position: { x: number; y: number } | null,
  ) => {
    if (position === null) {
      refs.setReference(null)
      return
    }

    if (!chartRef.current) return

    const chartRect = chartRef.current.getBoundingClientRect()

    refs.setReference({
      getBoundingClientRect() {
        const x = chartRect.x + position.x
        const y = chartRect.y + position.y

        return {
          width: 0,
          height: 0,
          x: x,
          left: x,
          right: x,
          y: y,
          top: y,
          bottom: y,
        }
      },
    })
  }

  return {
    tooltipRef: refs.setFloating,
    chartRef,
    tooltipStyles: floatingStyles,
    onUpdatedTooltipPosition,
  }
}
