import { CARD_OUTLINE, type Transform } from '../canvas'

export const transform = (transform: Transform): string =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const scale = (scale: Transform['scale']): string => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): string =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const setSpatialCSSVariables = (
  element: HTMLElement,
  transform: Transform,
  precision: number = 3
) => {
  element.style.setProperty(
    '--spatial-view-translate-x',
    `${transform.translate.x.toFixed(precision)}px`
  )
  element.style.setProperty(
    '--spatial-view-translate-y',
    `${transform.translate.y.toFixed(precision)}px`
  )
  element.style.setProperty('--spatial-view-scale', `${transform.scale.toFixed(precision)}`)
  element.style.setProperty('--card-outline', `calc(${CARD_OUTLINE}px / var(--spatial-view-scale))`)
  element.style.setProperty('--card-element-scale', `calc(1.0 / var(--spatial-view-scale))`)
}
