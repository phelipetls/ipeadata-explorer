import { Canvg } from 'canvg'

export async function svgToPng(
  svg: SVGSVGElement,
  width: number,
  height: number
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  const canvg = await Canvg.from(ctx!, svg.outerHTML)

  canvg.start()

  return canvas.toDataURL()
}
