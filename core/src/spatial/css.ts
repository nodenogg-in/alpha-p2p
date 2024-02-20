import type { CanvasState } from '.'
import type { Transform } from '../schema'

export const transform = (transform: Transform): string =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const scale = (scale: Transform['scale']): string => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): string =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const getSpatialCSSVariables = (transform: Transform, precision: number = 3) => ({
  '--spatial-view-translate-x': `${transform.translate.x.toFixed(precision)}px`,
  '--spatial-view-translate-y': `${transform.translate.y.toFixed(precision)}px`,
  '--spatial-view-scale': `${transform.scale.toFixed(precision)}`,
  '--card-outline': `calc(var(--ui-weight) / var(--spatial-view-scale))`,
  '--card-element-scale': `calc(1.0 / var(--spatial-view-scale))`
})

export const setSpatialCSSVariables = (
  element: HTMLElement,
  transform: Transform,
  precision: number = 3
) => {
  for (const [key, value] of Object.entries(getSpatialCSSVariables(transform, precision))) {
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
