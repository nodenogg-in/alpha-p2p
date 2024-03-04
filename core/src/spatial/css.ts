import { MIN_ZOOM, type CanvasInteractionState, MAX_ZOOM } from '.'
import type { Box, Transform } from '../schema'
import { isString, mapRange } from '../utils'

export const cssNumber = (n: number | string): string => (isString(n) ? n : `${n}px`)

export const transform = (transform: Transform): string =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const boxStyle = (box: Box, inset: number = 0) => ({
  width: `${box.width - inset}px`,
  height: `${box.height - inset}px`,
  transform: translate({ x: box.x + inset / 2, y: box.y + inset / 2 })
})

export const scale = (scale: Transform['scale']): string => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): string =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const getSpatialCSSVariables = (canvas: CanvasInteractionState) => ({
  '--spatial-view-transform': transform(canvas.transform),
  '--card-outline': `${canvas.cardOutline / canvas.transform.scale}px`,
  '--card-element-scale': 1.0 / canvas.transform.scale
})

export const setSpatialCSSVariables = (element: HTMLElement, canvas: CanvasInteractionState) => {
  for (const [key, value] of Object.entries(getSpatialCSSVariables(canvas))) {
    element.style.setProperty(key, value.toString())
  }
}

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
    opacity: mapRange(canvas.transform.scale, MIN_ZOOM, MAX_ZOOM, 0.3, 1.0)
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
