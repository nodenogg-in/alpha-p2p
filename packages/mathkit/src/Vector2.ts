import {
  ceil as _ceil,
  floor as _floor,
  min as _min,
  max as _max,
  round as _round,
  lerp as _lerp,
  sqrt,
  abs,
  acos
} from './number'
import type { Matrix2D, Vector2 } from './api'

export type { Vector2 } from './api'

export const EPS = 0.000001

export const set = (v: Vector2, x: number, y: number) => {
  v[0] = x
  v[1] = y
  return v
}

export const vector2 = (initial: Vector2 = [0, 0]): Vector2 =>
  set(new Float32Array(2), initial[0], initial[1])

export const clone = (v: Vector2) => vector2([v[0], v[1]])

export const copy = (v: Vector2, a: Vector2) => set(v, a[0], a[1])

export const reset = (v: Vector2) => set(v, 0, 0)

export const add = (v: Vector2, a: Vector2, b: Vector2) => set(v, a[0] + b[0], a[1] + b[1])

export const subtract = (v: Vector2, a: Vector2, b: Vector2) => set(v, a[0] - b[0], a[1] - b[1])

export const multiply = (v: Vector2, a: Vector2, b: Vector2) => set(v, a[0] * b[0], a[1] * b[1])

export const divide = (v: Vector2, a: Vector2, b: Vector2) => set(v, a[0] / b[0], a[1] / b[1])

export const ceil = (v: Vector2, a: Vector2) => set(v, _ceil(a[0]), _ceil(a[1]))

export const floor = (v: Vector2, a: Vector2) => set(v, _floor(a[0]), _floor(a[1]))

export const min = (v: Vector2, a: Vector2, b: Vector2) =>
  set(v, _min(a[0], b[0]), _min(a[1], b[1]))

export const max = (v: Vector2, a: Vector2, b: Vector2) =>
  set(v, _max(a[0], b[0]), _max(a[1], b[1]))

export const round = (v: Vector2, a: Vector2) => set(v, _round(a[0]), _round(a[1]))

export const scale = (v: Vector2, a: Vector2, b: number) => set(v, a[0] * b, a[1] * b)

export const scaleAndAdd = (v: Vector2, a: Vector2, b: Vector2, scale: number) =>
  set(v, a[0] + b[0] * scale, a[1] + b[1] * scale)

export const distance = (a: Vector2, b: Vector2) => {
  const x = b[0] - a[0],
    y = b[1] - a[1]
  return sqrt(x * x + y * y)
}

export const squaredDistance = (a: Vector2, b: Vector2) => {
  const x = b[0] - a[0],
    y = b[1] - a[1]
  return x * x + y * y
}

export const length = (a: Vector2) => {
  const x = a[0],
    y = a[1]
  return sqrt(x * x + y * y)
}

export const squaredLength = (a: Vector2) => {
  const x = a[0],
    y = a[1]
  return x * x + y * y
}

export const negate = (v: Vector2, a: Vector2) => set(v, -a[0], -a[1])

export const inverse = (v: Vector2, a: Vector2) => set(v, 1.0 / a[0], 1.0 / a[1])

export const normalize = (v: Vector2, a: Vector2) => {
  const x = a[0],
    y = a[1]
  let len = x * x + y * y
  if (len > 0) {
    len = 1 / Math.sqrt(len)
  }

  return set(v, a[0] * len, a[1] * len)
}

export const dot = (a: Vector2, b: Vector2) => a[0] * b[0] + a[1] * b[1]

export const lerp = (v: Vector2, a: Vector2, b: Vector2, amount: number) =>
  set(v, _lerp(a[0], b[0], amount), _lerp(a[1], b[1], amount))

export const transformMatrix2D = (v: Vector2, a: Vector2 | [number, number], m: Matrix2D) =>
  set(v, m[0] * a[0] + m[2] * a[1] + m[4], m[1] * a[0] + m[3] * a[1] + m[5])

export const rotate = (v: Vector2, a: Vector2, b: Vector2, rad: number) => {
  const p0 = a[0] - b[0],
    p1 = a[1] - b[1],
    sinC = Math.sin(rad),
    cosC = Math.cos(rad)

  return set(v, p0 * cosC - p1 * sinC + b[0], p0 * sinC + p1 * cosC + b[1])
}

export const angle = (a: Vector2, b: Vector2) => {
  const x1 = a[0],
    y1 = a[1],
    x2 = b[0],
    y2 = b[1],
    mag = sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)),
    cosine = mag && (x1 * x2 + y1 * y2) / mag
  return acos(_min(_max(cosine, -1), 1))
}

export const exactEquals = (a: Vector2, b: Vector2) => a[0] === b[0] && a[1] === b[1]

export const equals = (a: Vector2, b: Vector2) => {
  const a0 = a[0],
    a1 = a[1]
  const b0 = b[0],
    b1 = b[1]
  return (
    Math.abs(a0 - b0) <= EPS * _max(1.0, abs(a0), abs(b0)) &&
    Math.abs(a1 - b1) <= EPS * _max(1.0, abs(a1), abs(b1))
  )
}
