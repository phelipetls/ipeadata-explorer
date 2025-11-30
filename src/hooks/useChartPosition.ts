import { useEffect, useState, type RefObject } from 'react'

export function useChartPosition(chartRef: RefObject<Element | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!chartRef.current) return

    const rect = chartRef.current.getBoundingClientRect()

    setPosition({
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY,
    })
  }, [chartRef])

  return position
}
