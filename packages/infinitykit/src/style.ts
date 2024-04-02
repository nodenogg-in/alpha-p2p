import { mapRange } from '@nodenogg.in/toolkit'
import type { Box, CanvasInteractionState, Transform } from '.'

export const transform = (transform: Transform): string =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const boxStyle = (box: Box, inset: number = 0) =>
  `width: ${box.width - inset}px; height: ${box.height - inset}px; transform: ${translate({ x: box.x + inset / 2, y: box.y + inset / 2 })}`

export const scale = (scale: Transform['scale']): string => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): string =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const getGridSVGPattern = (canvas: CanvasInteractionState) => {
  const size = canvas.grid * canvas.transform.scale * 1

  const originX = canvas.viewport.width / 2
  const originY = canvas.viewport.height / 2

  const scaledOriginX = originX * canvas.transform.scale
  const scaledOriginY = originY * canvas.transform.scale

  return {
    width: size,
    height: size,
    patternTransform: translate({
      x: -(scaledOriginX - originX - canvas.transform.translate.x),
      y: -(scaledOriginY - originY - canvas.transform.translate.y)
    }),
    patternUnits: 'userSpaceOnUse',
    opacity: mapRange(canvas.transform.scale, canvas.zoom.min, canvas.zoom.max, 0.3, 1.0)
  }
}

export const getElementBox = (element: HTMLElement): Box => {
  const { top: y, left: x, width, height } = element.getBoundingClientRect()
  return {
    x,
    y,
    width,
    height
  }
}
