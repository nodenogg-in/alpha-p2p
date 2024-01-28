import type { CSSProperties } from 'vue'
import type { Transform, Point } from '..'

export const transformToCSSMatrix = (transform: Transform): CSSProperties['transform'] =>
  `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.translate.x}, ${transform.translate.y})`

export const transformToCSSScale = (transform: Transform): CSSProperties['transform'] =>
  `scale(${transform.scale}`

export const transformToCSSTransform = (transform: Transform): CSSProperties['transform'] =>
  `translate(${transform.translate.x}px, ${transform.translate.y}px) scale(${transform.scale}`

export const getDotPattern = (
  color: string,
  gridSize: number,
  dotSize: number,
  position: Point
): CSSProperties => ({
  backgroundImage: `radial-gradient(${color} ${dotSize}px, transparent ${dotSize}px)`,
  backgroundSize: `${gridSize}px ${gridSize}px`,
  backgroundOrigin: 'border-box',
  backgroundPosition: `center ${position.y + gridSize / 2}px center ${position.x + gridSize / 2}px`,
  backgroundPositionX: `${position.x + gridSize / 2}px`,
  backgroundPositionY: `${position.y + gridSize / 2}px`,
})

export const getGridPattern = (
  color: string,
  gridSize: number,
  dotSize: number,
  position: Point
): CSSProperties => ({
  backgroundSize: `${gridSize}px ${gridSize}px`,
  backgroundImage: `linear-gradient(to right, ${color} ${dotSize}px, rgba(240, 240, 240, 0.0) 1px),
linear-gradient(to bottom, ${color} ${dotSize}px, rgba(240, 240, 240, 0.0) 1px)`,
  backgroundPosition: `${position.x}px ${position.y}px`
})
