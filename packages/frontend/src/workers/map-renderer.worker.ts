import * as d3 from 'd3'
import type { FeatureCollection } from 'geojson'

export type MapRendererMessage =
  | {
      type: 'render'
      payload: {
        geojson: FeatureCollection
        title?: string
        data: {
          date: Date
          value: number | null
          region?: { name: string; code: number }
        }[]
        canvas: OffscreenCanvas
        dpr: number
        width: number
        height: number
        marginBottom: number
        selectedRegionCode: string
        colorScheme: readonly string[]
        legendLabel: string
        outlineColor: string
        fontFamily: string
        backgroundColor: string
      }
    }
  | {
      type: 'projectionInvert'
      payload: {
        x: number
        y: number
      }
    }
  | {
      type: 'projectionInverted'
      payload: {
        x: number
        y: number
      }
    }
  | {
      type: 'rendered'
      payload: {
        bitmap: ImageBitmap
      }
    }
  | {
      type: 'rendering'
    }

let projection: d3.GeoProjection | null = null

self.onmessage = (event: MessageEvent<MapRendererMessage>) => {
  const { type } = event.data

  if (type === 'render') {
    self.postMessage({
      type: 'rendering',
    })
    render(event.data)
  }

  if (type === 'projectionInvert') {
    if (projection === null) return
    if (projection.invert == null) return

    const point = projection.invert([
      event.data.payload.x,
      event.data.payload.y,
    ])

    if (!point) {
      return
    }

    const [x, y] = point
    self.postMessage({
      type: 'projectionInverted',
      payload: { x, y },
    })
  }
}

function render(message: Extract<MapRendererMessage, { type: 'render' }>) {
  const {
    geojson,
    title,
    data,
    width,
    height,
    marginBottom,
    selectedRegionCode,
    colorScheme,
    legendLabel,
    dpr,
    outlineColor,
    fontFamily,
    backgroundColor,
  } = message.payload

  const offscreenCanvas = new OffscreenCanvas(width, height)
  const context = offscreenCanvas.getContext('2d', { alpha: false })
  if (!context) return

  offscreenCanvas.width = width * dpr
  offscreenCanvas.height = height * dpr
  context.scale(dpr, dpr)

  context.beginPath()
  context.fillStyle = backgroundColor
  context.fillRect(0, 0, width, height)

  const filteredGeoJson: FeatureCollection = {
    ...geojson,
    features: geojson.features.filter((feature) => {
      return (
        selectedRegionCode === 'brazil' ||
        feature.properties?.['stateCode'] === Number(selectedRegionCode) ||
        feature.properties?.['regionCode'] === Number(selectedRegionCode)
      )
    }),
  }

  const filteredRegionCodes = new Set(
    filteredGeoJson.features.map((feature) => feature.properties?.['code']),
  )

  const filteredValues = data
    .filter((item) => filteredRegionCodes.has(item.region?.['code']))
    .map((item) => item.value)
    .filter((value): value is number => value !== null)

  const min = Math.min(...filteredValues)
  const max = Math.max(...filteredValues)

  const safeMin = min === Infinity ? 0 : min
  const safeMax = max === -Infinity ? 0 : max
  const effectiveMin = safeMin === safeMax ? safeMin - 1 : safeMin

  const colorScale = d3.scaleQuantize([effectiveMin, safeMax], colorScheme)

  const titleHeight = title ? 30 : 0

  const legendLabelSpacing = 4
  const legendBinHeight = 8
  const legendTickHeight = legendBinHeight + 6
  const legendTickLabelSpacing = 6

  const marginTop = titleHeight

  projection = d3.geoMercator().fitExtent(
    [
      [0, marginTop],
      [width, height - marginBottom],
    ],
    filteredGeoJson,
  )

  const path = d3.geoPath(projection, context)

  const bounds = path.bounds(filteredGeoJson)
  const [[x0], [x1]] = bounds
  const mapWidth = x1 - x0
  const legendMarginInline = 30
  const legendWidth = Math.min(mapWidth - legendMarginInline, 400)
  const legendX = x0 + (mapWidth - legendWidth) / 2
  const legendY = height - marginBottom

  if (title) {
    context.fillStyle = '#000000'
    context.font = `bold 14px ${fontFamily}`
    context.textAlign = 'center'
    context.textBaseline = 'top'
    context.fillText(title, width / 2, 0)
  }

  const dataMap = new Map<number, number | null>()
  for (const item of data) {
    if (item.region?.code) {
      dataMap.set(item.region.code, item.value)
    }
  }

  for (const feature of filteredGeoJson.features) {
    const code = feature.properties?.['code']
    const value = dataMap.get(code)
    const color = value != null ? colorScale(value) : null

    context.beginPath()
    path(feature)

    if (value === null || color === null) {
      const patternCanvas = new OffscreenCanvas(8, 8)
      const patternContext = patternCanvas.getContext('2d')
      if (patternContext) {
        patternContext.strokeStyle = '#ccc'
        patternContext.lineWidth = 1
        patternContext.beginPath()
        patternContext.moveTo(0, 8)
        patternContext.lineTo(8, 0)
        patternContext.moveTo(-2, 2)
        patternContext.lineTo(2, -2)
        patternContext.moveTo(6, 10)
        patternContext.lineTo(10, 6)
        patternContext.stroke()

        const pattern = context.createPattern(patternCanvas, 'repeat')
        if (pattern) {
          context.fillStyle = pattern
        }
      }
    } else {
      context.fillStyle = color
    }
    context.fill()

    context.strokeStyle = outlineColor
    context.lineWidth = 0.5
    context.stroke()
  }

  const bins = colorScale.range().map((color) => {
    const [min, max] = colorScale.invertExtent(color)
    return { color, min, max }
  })

  const legendBinWidth = legendWidth / bins.length

  context.fillStyle = '#000000'
  context.font = `bold 14px ${fontFamily}`
  context.textAlign = 'left'
  context.textBaseline = 'hanging'
  const legendLabelMetrics = context.measureText(legendLabel)
  const legendLabelHeight =
    legendLabelMetrics.actualBoundingBoxAscent +
    legendLabelMetrics.actualBoundingBoxDescent

  context.fillText(legendLabel, legendX, legendY)

  drawLegend(context, {
    x: legendX,
    y: legendY + legendLabelHeight + legendLabelSpacing,
    width: legendWidth,
    height: legendBinHeight,
    bins: bins.map((bin, index) => {
      return {
        color: bin.color,
        x: legendX + index * legendBinWidth,
        y: legendY + legendLabelHeight + legendLabelSpacing,
        width: legendBinWidth,
        height: legendBinHeight,
      }
    }),
    ticks: bins.flatMap((bin, i) => {
      const y = legendY + legendLabelHeight + legendLabelSpacing

      const minTick = {
        value: bin.min,
        x: legendX + i * legendBinWidth,
        y,
        textY: y + legendTickHeight + legendTickLabelSpacing,
        height: legendTickHeight,
      }

      if (i === bins.length - 1) {
        return [
          minTick,
          {
            ...minTick,
            value: bin.max,
            x: legendX + (i + 1) * legendBinWidth,
          },
        ]
      }

      return [minTick]
    }),
    label: legendLabel,
    labelSpacing: legendLabelSpacing,
    fontFamily,
  })

  self.postMessage({
    type: 'rendered',
    payload: { bitmap: offscreenCanvas.transferToImageBitmap() },
  })
}

function drawLegend(
  context: OffscreenCanvasRenderingContext2D,
  props: {
    x: number
    y: number
    width: number
    height: number
    bins: {
      color: string
      x: number
      y: number
      width: number
      height: number
    }[]
    ticks: {
      value: number
      x: number
      y: number
      height: number
      textY: number
    }[]
    label: string
    labelSpacing: number
    fontFamily: string
  },
) {
  const { bins, ticks, fontFamily } = props

  bins.forEach((bin) => {
    context.fillStyle = bin.color
    context.fillRect(bin.x, bin.y, bin.width, bin.height)
  })

  const formatTick = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  context.fillStyle = '#000000'
  context.font = `12px ${fontFamily}`
  context.textAlign = 'center'
  context.textBaseline = 'top'
  context.strokeStyle = '#000000'

  ticks.forEach((tick) => {
    context.beginPath()
    context.moveTo(tick.x, tick.y)
    context.lineTo(tick.x, tick.y + tick.height)
    context.stroke()
    context.fillText(formatTick(tick.value), tick.x, tick.textY)
  })
}
