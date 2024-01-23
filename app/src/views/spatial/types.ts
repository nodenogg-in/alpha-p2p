export type Size = {
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

export interface Transform {
  translate: Point
  scale: number
}

export type Box = Point & Size

export const isBox = (box: Box | Point): box is Box => {
  return 'width' in box && 'height' in box
}
// const arrowTuple = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'] as const
// const arrows = new Set(arrowTuple)

// export type Arrow = (typeof arrowTuple)[number]
// export const isArrow = (key: string): key is Arrow => arrows.has(key as Arrow)

export const defaultSize = (): Size => ({
  width: 0,
  height: 0
})

export const defaultTransform = (): Transform => ({
  translate: {
    x: 0,
    y: 0
  },
  scale: 1
})

export const defaultBox = (): Box => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0
})

export const defaultPoint = (): Point => ({
  x: 0,
  y: 0
})
