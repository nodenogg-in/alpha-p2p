import type { CanvasState } from '.'
import type { Box, Transform } from '../schema'

export const transform = (transform: Transform): string =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const scale = (scale: Transform['scale']): string => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): string =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const getSpatialCSSVariables = (canvas: CanvasState) => ({
  '--spatial-view-transform': transform(canvas.transform),
  '--card-outline': `calc(var(--ui-weight) / var(--spatial-view-scale))`,
  '--card-element-scale': `calc(1.0 / var(--spatial-view-scale))`
})

export const setSpatialCSSVariables = (element: HTMLElement, canvas: CanvasState) => {
  for (const [key, value] of Object.entries(getSpatialCSSVariables(canvas))) {
    element.style.setProperty(key, value)
  }
}

export type SVGPatternAttributes = {
  width: number
  height: number
  patternTransform: string
}

export const getGridSVGPattern = (canvas: CanvasState): SVGPatternAttributes => {
  const size = canvas.grid * canvas.transform.scale * 1

  const originX = canvas.container.width / 2
  const originY = canvas.container.height / 2

  const scaledOriginX = originX * canvas.transform.scale
  const scaledOriginY = originY * canvas.transform.scale

  return {
    width: size,
    height: size,
    patternTransform: translate({
      x: -(scaledOriginX - originX - canvas.transform.translate.x),
      y: -(scaledOriginY - originY - canvas.transform.translate.y)
    })
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
