import type { CSSProperties } from 'vue'
import type { Transform } from '..'

export const transform = (transform: Transform): CSSProperties['transform'] =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const scale = (scale: Transform['scale']): CSSProperties['transform'] =>
  `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Transform['translate']): CSSProperties['transform'] =>
  `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`
