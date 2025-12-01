import * as d3 from 'd3'
import { ChartTooltip } from './ChartTooltip'
import { ChartTooltipPortal } from './ChartTooltipPortal'
import { useRef, useEffect, useState } from 'react'
import { useFloatingChartTooltip } from '../hooks/useFloatingChartTooltip'
import { ChartContext, useChartContext } from '../context/ChartContext'
import clsx from 'clsx'
import { MousePointerTracker } from './MousePointerTracker'
import MapRendererWorker from '../workers/map-renderer.worker?worker'
import type { MapRendererMessage } from '../workers/map-renderer.worker'
import type { IbgeGeoJson } from '../types'
import { getCssVariable } from '../utils/get-css-variable'
import { LoadingIndicator } from './LoadingIndicator'
import { ChartCanvas } from './ChartCanvas'

interface ChoroplethMapProps extends React.ComponentPropsWithRef<'div'> {
  data: {
    date: Date
    value: number | null
    region?: { name: string; code: number }
  }[]
  geojson: IbgeGeoJson
  title?: string
  tooltipValueFormatter: (value: number) => string
  legendLabel: string
  selectedRegionCode: string
  colorScheme: readonly string[]
}

export function ChoroplethMap({
  data,
  geojson,
  title,
  tooltipValueFormatter,
  legendLabel,
  colorScheme,
  selectedRegionCode,
  ...rest
}: ChoroplethMapProps) {
  const chartContext = useChartContext()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const workerRef = useRef<Worker | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [pointer, setPointer] = useState<{
    x: number
    y: number
  } | null>(null)

  const { chartRef, tooltipRef, tooltipStyles, onUpdatedTooltipPosition } =
    useFloatingChartTooltip<HTMLDivElement>({
      placement: 'top',
    })

  useEffect(() => {
    const worker = new MapRendererWorker()
    workerRef.current = worker
    worker.postMessage({
      type: 'render',
      payload: {
        data,
        geojson,
        title,
        dpr: window.devicePixelRatio,
        width: chartContext.width,
        height: chartContext.height,
        marginBottom: chartContext.marginBottom,
        legendLabel,
        colorScheme,
        selectedRegionCode,
        outlineColor: getCssVariable('--color-chart-map-outline'),
        fontFamily: getCssVariable('--font-sans'),
        backgroundColor: chartContext.backgroundColor,
      },
    })

    worker.onmessage = (event: MessageEvent<MapRendererMessage>) => {
      if (event.data.type === 'rendering') {
        setIsLoading(true)
      }

      if (event.data.type === 'projectionInverted') {
        setPointer(event.data.payload)
      }

      if (event.data.type === 'rendered') {
        const canvas = canvasRef.current
        if (canvas) {
          const context = canvas.getContext('bitmaprenderer')
          context?.transferFromImageBitmap(event.data.payload.bitmap)
        }
        setIsLoading(false)
      }
    }

    return () => {
      workerRef.current = null
      worker.terminate()
    }
  }, [
    data,
    geojson,
    title,
    chartContext.width,
    chartContext.height,
    chartContext.marginBottom,
    chartContext.backgroundColor,
    legendLabel,
    colorScheme,
    selectedRegionCode,
  ])

  const hoveredFeature = pointer
    ? geojson.features.find((feature) => {
        return (
          (selectedRegionCode === 'brazil' ||
            feature.properties.stateCode === Number(selectedRegionCode) ||
            feature.properties.regionCode === Number(selectedRegionCode)) &&
          d3.geoContains(feature, [pointer.x, pointer.y])
        )
      })
    : null

  const hoveredFeatureData = hoveredFeature
    ? (data.find(
        (item) => item.region?.code === hoveredFeature.properties.code,
      ) ?? null)
    : null

  return (
    <ChartContext.Provider value={chartContext}>
      <div {...rest}>
        <MousePointerTracker
          ref={chartRef}
          onPointerChange={(pointer) => {
            onUpdatedTooltipPosition(pointer)

            if (!pointer) {
              setPointer(null)
              return
            }

            if (workerRef.current) {
              workerRef.current.postMessage({
                type: 'projectionInvert',
                payload: {
                  x: pointer.x,
                  y: pointer.y,
                },
              })
            }
          }}
          className={clsx('grid', isLoading && 'opacity-75')}
          style={{ width: chartContext.width, height: chartContext.height }}
        >
          {isLoading && (
            <div
              className={clsx('row-1 col-span-full grid place-items-center')}
            >
              <LoadingIndicator />
            </div>
          )}

          <ChartCanvas className='row-1 col-span-full' ref={canvasRef} />
        </MousePointerTracker>

        {hoveredFeature && (
          <ChartTooltipPortal>
            <ChartTooltip
              ref={tooltipRef}
              style={tooltipStyles}
              className='text-sm flex flex-col gap-2'
            >
              <span className='font-bold'>
                {hoveredFeature.properties.name}
              </span>

              <span className=''>
                {hoveredFeatureData?.value != null
                  ? tooltipValueFormatter(hoveredFeatureData.value)
                  : 'Sem dados'}
              </span>
            </ChartTooltip>
          </ChartTooltipPortal>
        )}
      </div>
    </ChartContext.Provider>
  )
}
