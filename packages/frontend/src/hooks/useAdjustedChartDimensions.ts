import { useLayoutEffect, useRef, useState } from 'react'
import { useChartContext } from '../context/ChartContext'

export function useAdjustedChartDimensions() {
  const yAxisTicksRef = useRef<SVGGElement[]>([])
  const yAxisLabelRef = useRef<SVGTextElement | null>(null)
  const xAxisTicksRef = useRef<SVGGElement[]>([])
  const titleRef = useRef<SVGForeignObjectElement | null>(null)
  const legendRef = useRef<HTMLUListElement | null>(null)

  const chartContext = useChartContext()

  const [maxYAxisTickWidth, setMaxYAxisTickWidth] = useState(0)
  const [yAxisLabelHeight, setYAxisLabelHeight] = useState(0)
  const [maxXAxisTickHeight, setMaxXAxisTickHeight] = useState(0)
  const [titleHeight, setTitleHeight] = useState(0)
  const [legendHeight, setLegendHeight] = useState(0)

  useLayoutEffect(() => {
    if (yAxisTicksRef.current.length > 0) {
      const maxWidth = Math.max(
        ...yAxisTicksRef.current.map((text) => Math.ceil(text.getBBox().width)),
      )
      setMaxYAxisTickWidth(maxWidth)
    }
  }, [])

  useLayoutEffect(() => {
    if (yAxisLabelRef.current) {
      const height = yAxisLabelRef.current.getBBox().height
      setYAxisLabelHeight(height)
    }
  }, [])

  useLayoutEffect(() => {
    if (xAxisTicksRef.current.length > 0) {
      const maxHeight = Math.max(
        ...xAxisTicksRef.current.map((text) =>
          Math.ceil(text.getBBox().height),
        ),
      )
      setMaxXAxisTickHeight(maxHeight)
    }
  }, [])

  useLayoutEffect(() => {
    if (titleRef.current) {
      const height = titleRef.current.getBBox().height
      setTitleHeight(height)
    }
  }, [])

  useLayoutEffect(() => {
    if (legendRef.current) {
      const rect = legendRef.current.getBoundingClientRect()
      setLegendHeight(rect.height)
    }
  }, [])

  const gap = 8

  let marginLeft = Math.max(chartContext.marginLeft, maxYAxisTickWidth)
  if (yAxisLabelHeight) {
    marginLeft = maxYAxisTickWidth + gap + yAxisLabelHeight
  }

  const marginTop = titleHeight ? titleHeight + gap * 2 : chartContext.marginTop

  let marginBottom = Math.max(chartContext.marginBottom, maxXAxisTickHeight)
  if (legendHeight) {
    marginBottom = marginBottom + legendHeight
  }

  const height = chartContext.height + legendHeight + titleHeight

  return {
    yAxisTicksRef,
    yAxisLabelRef,
    xAxisTicksRef,
    legendRef,
    titleRef,
    dimensions: {
      ...chartContext,
      height,
      marginTop,
      marginLeft,
      marginBottom,
    },
  }
}
