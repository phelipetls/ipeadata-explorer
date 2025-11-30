import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export function useContainerWidth(defaultWidth: number = 600) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(defaultWidth)

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setWidth(rect.width)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      const rect = entry.contentRect
      setWidth(rect.width)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return { containerRef, width }
}
