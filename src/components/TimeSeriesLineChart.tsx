import { useState } from 'react'
import * as d3 from 'd3'
import { ChartContext } from '../context/ChartContext'
import { useChartPosition } from '../hooks/useChartPosition'
import { ChartXAxis } from './ChartXAxis'
import { ChartXTick } from './ChartXTick'
import { ChartYTick } from './ChartYTick'
import locale_ptBR from 'd3-time-format/locale/pt-BR' with { type: 'json' }
import { useFloatingChartTooltip } from '../hooks/useFloatingChartTooltip'
import { ChartGridLine } from './ChartGridLine'
import { ChartYAxis } from './ChartYAxis'

import { ChartSVG } from './ChartSVG'
import { ChartLine } from './ChartLine'
import { createDateTicks } from '../utils/d3-ticks'
import { getTimeSeriesScales } from '../utils/d3-scales'
import { useAdjustedChartDimensions } from '../hooks/useAdjustedChartDimensions'
import { ChartYAxisLabel } from './ChartYAxisLabel'
import { ChartTooltip } from './ChartTooltip'
import { ChartTooltipPortal } from './ChartTooltipPortal'
import { TooltipNumericValue } from './TooltipNumericValue'
import { CategoricalLegend } from './CategoricalLegend'
import { ChartTitleSVG } from './ChartTitleSVG'

type Props = {
  data: { value: number | null; date: Date }[]
  yAxisLabel?: string
  yAxisTickFormatter: (value: number) => string
  tooltipDateFormatter: (date: Date) => string
  yAxisStartsAtZero: boolean
  color?: string
  title?: string
  legend?: Array<{ color: string; label: string }>
}

// @ts-expect-error because it works
d3.timeFormatDefaultLocale(locale_ptBR)

const TICK_SIZE = 6
const Y_TICK_TEXT_GAP = 4
const X_TICK_TEXT_GAP = 14

export function TimeSeriesLineChart({
  data,
  yAxisLabel,
  yAxisTickFormatter,
  tooltipDateFormatter,
  yAxisStartsAtZero,
  color = 'var(--color-chart-data-line)',
  title,
  legend,
}: Props) {
  const { chartRef, tooltipRef, tooltipStyles, onUpdatedTooltipPosition } =
    useFloatingChartTooltip<SVGSVGElement>({
      placement: 'top',
    })

  const [hoveredPoint, setHoveredPoint] = useState<
    (typeof data)[number] | null
  >(null)

  const {
    dimensions,
    yAxisTicksRef,
    yAxisLabelRef,
    xAxisTicksRef,
    titleRef,
    legendRef,
  } = useAdjustedChartDimensions()

  const position = useChartPosition(chartRef)

  const dates = data.map((item) => item.date)

  const [x, y] = getTimeSeriesScales(data, dimensions, {
    yAxisStartsAtZero,
  })

  const line = d3
    .line<{ value: number | null; date: Date }>()
    .defined((d) => d.value !== null)
    .x((d) => x(d.date))
    .y((d) => y(d.value as number))

  const chartWidth =
    dimensions.width - dimensions.marginLeft - dimensions.marginRight
  const xTicks = createDateTicks(x, dates, chartWidth)

  const yTicks = y.ticks()

  const xTickFormatter = x.tickFormat()
  const yTickFormatter = yAxisTickFormatter

  return (
    <ChartContext.Provider value={dimensions}>
      <ChartSVG
        className='relative'
        ref={chartRef}
        onMouseMove={(e) => {
          const [pointerX] = d3.pointer(e)
          const closestDate = x.invert(pointerX)
          const dateIndex = d3.bisect(dates, closestDate)

          const point = data[dateIndex]
          if (point?.value == null) {
            return
          }

          setHoveredPoint(point)

          const positionX = x(point.date)
          const positionY = y(point.value)

          onUpdatedTooltipPosition({ x: positionX, y: positionY })
        }}
        onMouseLeave={() => {
          setHoveredPoint(null)
          setHoveredPoint(null)
        }}
      >
        {title && <ChartTitleSVG ref={titleRef}>{title}</ChartTitleSVG>}

        {yAxisLabel && (
          <ChartYAxisLabel ref={yAxisLabelRef}>{yAxisLabel}</ChartYAxisLabel>
        )}

        <ChartYAxis>
          {yTicks.map((tick, i) => (
            <g key={i} transform={`translate(0,${y(tick)})`}>
              <ChartYTick
                ref={(node) => {
                  if (node) {
                    yAxisTicksRef.current[i] = node
                  }
                }}
                size={TICK_SIZE}
                gap={Y_TICK_TEXT_GAP}
              >
                {yTickFormatter(tick)}
              </ChartYTick>
              <ChartGridLine />
            </g>
          ))}
        </ChartYAxis>

        {legend && legend.length > 0 && (
          <CategoricalLegend
            ref={legendRef}
            items={legend}
            position={position}
          />
        )}

        <ChartXAxis>
          {xTicks.map((tick, i) => (
            <g
              key={i}
              ref={(node) => {
                if (node) {
                  xAxisTicksRef.current[i] = node
                }
              }}
              transform={`translate(${x(tick)},0)`}
            >
              <ChartXTick size={TICK_SIZE} gap={X_TICK_TEXT_GAP}>
                {xTickFormatter(tick)}
              </ChartXTick>
            </g>
          ))}
        </ChartXAxis>

        <ChartLine stroke={color} d={line(data) ?? ''} />

        {hoveredPoint && hoveredPoint.value && (
          <circle
            transform={`translate(${x(hoveredPoint.date)}, ${y(hoveredPoint.value)})`}
            r='4'
            fill={color}
          />
        )}

        {hoveredPoint && hoveredPoint.value && (
          <ChartTooltipPortal>
            <ChartTooltip
              ref={tooltipRef}
              style={tooltipStyles}
              className='flex flex-col items-center'
            >
              <span className='text-sm font-medium'>
                {tooltipDateFormatter(hoveredPoint.date)}
              </span>

              <span className='text-sm font-semibold'>
                <TooltipNumericValue value={hoveredPoint.value} />
              </span>
            </ChartTooltip>
          </ChartTooltipPortal>
        )}
      </ChartSVG>
    </ChartContext.Provider>
  )
}
