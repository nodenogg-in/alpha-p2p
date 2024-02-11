import type { CSSProperties } from 'vue'
import type { Transform } from '..'

export const transform = (transform: Transform): CSSProperties['transform'] =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const scale = (scale: Transform['scale']): CSSProperties['transform'] =>
  `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): CSSProperties['transform'] =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const setSpatialCSSVariables = (
  element: HTMLElement,
  transform: Transform,
  cardOutline: number = 2,
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
  element.style.setProperty('--card-outline', `calc(${cardOutline}px / var(--spatial-view-scale))`)
  element.style.setProperty('--card-element-scale', `calc(1.0 / var(--spatial-view-scale))`)
}
