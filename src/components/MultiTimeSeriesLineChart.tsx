import * as d3 from 'd3'
import { ChartContext } from '../context/ChartContext'
import { ChartXAxis } from './ChartXAxis'
import { ChartXTick } from './ChartXTick'
import { ChartYTick } from './ChartYTick'
import locale_ptBR from 'd3-time-format/locale/pt-BR' with { type: 'json' }
import { ChartGridLine } from './ChartGridLine'
import { ChartYAxis } from './ChartYAxis'
import { ChartSVG } from './ChartSVG'
import { ChartLine } from './ChartLine'
import { createDateTicks } from '../utils/d3-ticks'
import { getTimeSeriesScales } from '../utils/d3-scales'
import { ChartYAxisLabel } from './ChartYAxisLabel'
import { useAdjustedChartDimensions } from '../hooks/useAdjustedChartDimensions'
import { ChartTooltipPortal } from './ChartTooltipPortal'
import { ChartTooltip } from './ChartTooltip'
import { useState } from 'react'
import { useFloatingChartTooltip } from '../hooks/useFloatingChartTooltip'
import { TooltipNumericValue } from './TooltipNumericValue'
import { CategoricalLegend } from './CategoricalLegend'
import { useChartPosition } from '../hooks/useChartPosition'
import { ChartTitleSVG } from './ChartTitleSVG'

type Props = {
  data: Record<string, { value: number | null; date: Date }[]>
  title?: string
  yAxisLabel: string
  yAxisTickFormatter: (value: number) => string
  tooltipDateFormatter: (date: Date) => string
  yAxisStartsAtZero: boolean
}

// @ts-expect-error because it works
d3.timeFormatDefaultLocale(locale_ptBR)

const TICK_SIZE = 6
const Y_TICK_TEXT_GAP = 4
const X_TICK_TEXT_GAP = 14

const colors = d3.schemeCategory10.slice(0)

export function MultiTimeSeriesLineChart({
  data,
  title,
  yAxisLabel,
  yAxisTickFormatter,
  tooltipDateFormatter,
  yAxisStartsAtZero,
}: Props) {
  const { chartRef, tooltipRef, tooltipStyles, onUpdatedTooltipPosition } =
    useFloatingChartTooltip<SVGSVGElement>({
      placement: 'right-start',
    })

  const position = useChartPosition(chartRef)

  const [hoveredPoints, setHoveredPoints] = useState<
    {
      date: Date
      value: number
      category: string
      color: string
    }[]
  >([])

  const { dimensions, titleRef, legendRef, yAxisLabelRef, yAxisTicksRef } =
    useAdjustedChartDimensions()

  const flattenedData = Object.values(data).flat()
  const [x, y] = getTimeSeriesScales(flattenedData, dimensions, {
    yAxisStartsAtZero,
  })

  const line = d3
    .line<{ value: number | null; date: Date }>()
    .defined((d) => d.value !== null)
    .x((d) => x(d.date))
    .y((d) => y(d.value as number))

  const dates = Array.from(
    new Set(flattenedData.map((item) => item.date.getTime())),
  ).map((timestamp) => new Date(timestamp))

  const chartWidth =
    dimensions.width - dimensions.marginLeft - dimensions.marginRight
  const xTicks = createDateTicks(x, dates, chartWidth)
  const yTicks = y.ticks()

  const xTickFormatter = x.tickFormat()
  const yTickFormatter = yAxisTickFormatter

  return (
    <ChartContext.Provider value={dimensions}>
      <ChartSVG
        ref={chartRef}
        onMouseMove={(e) => {
          const [pointerX] = d3.pointer(e)
          const closestDate = x.invert(pointerX)
          const dateIndex = d3.bisect(dates, closestDate)

          const points = Object.entries(data).flatMap(
            ([category, series], categoryIndex) => {
              const point = series[dateIndex]
              if (!point) {
                return []
              }

              if (point.value === null) {
                return []
              }

              return [
                {
                  date: point.date,
                  value: point.value,
                  category,
                  color: colors[categoryIndex] ?? 'transparent',
                },
              ]
            },
          )

          if (points.length === 0) return

          setHoveredPoints(points)

          const point = hoveredPoints[0]
          if (!point) return

          const tooltipPosition = {
            x: x(point.date),
            y: Math.min(...hoveredPoints.map((point) => y(point.value))),
          }

          onUpdatedTooltipPosition(tooltipPosition)
        }}
        onMouseLeave={() => {
          setHoveredPoints([])
          onUpdatedTooltipPosition(null)
        }}
      >
        {title && <ChartTitleSVG ref={titleRef}>{title}</ChartTitleSVG>}

        <ChartXAxis>
          {xTicks.map((tick, i) => (
            <g key={i} transform={`translate(${x(tick)},0)`}>
              <ChartXTick size={TICK_SIZE} gap={X_TICK_TEXT_GAP}>
                {xTickFormatter(tick)}
              </ChartXTick>
            </g>
          ))}
        </ChartXAxis>

        <ChartYAxisLabel ref={yAxisLabelRef}>{yAxisLabel}</ChartYAxisLabel>

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

        {Object.entries(data).map(([category, values], i) => (
          <ChartLine
            key={category}
            d={line(values) ?? ''}
            stroke={colors[i] ?? 'transparent'}
          />
        ))}

        {hoveredPoints.length > 0 &&
          hoveredPoints.map((point) => (
            <circle
              transform={`translate(${x(point.date)}, ${y(point.value)})`}
              r='4'
              fill={point.color}
            />
          ))}

        {hoveredPoints.length > 0 && (
          <ChartTooltipPortal>
            <ChartTooltip ref={tooltipRef} style={tooltipStyles}>
              <div className='mb-1 font-bold'>
                {tooltipDateFormatter(hoveredPoints[0]!.date)}
              </div>

              <div className='flex flex-col gap-1'>
                {hoveredPoints.map((point) => {
                  if (!point.value) return null

                  return (
                    <div
                      key={point.category}
                      className='flex flex-row gap-2 items-center'
                    >
                      <div
                        style={
                          {
                            'background-color': point.color,
                          } as React.CSSProperties
                        }
                        className='w-[12px] aspect-square rounded-full border border-outline'
                      />

                      <div className='text-sm'>
                        <span className='font-medium'>{point.category}:</span>{' '}
                        <TooltipNumericValue value={point.value} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </ChartTooltip>
          </ChartTooltipPortal>
        )}

        <CategoricalLegend
          ref={legendRef}
          items={Object.entries(data).map(([category], index) => {
            return {
              color: colors[index] ?? 'transparent',
              label: category,
            }
          })}
          position={position}
        />
      </ChartSVG>
    </ChartContext.Provider>
  )
}
