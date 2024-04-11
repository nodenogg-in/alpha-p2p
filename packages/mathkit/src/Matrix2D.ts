import type { Matrix2D, Vector2 } from './api'
import { EPS } from './constants'
import { sin, cos, sqrt, abs, max } from './number'

export type { Matrix2D } from './api'

export const matrix2D = (initial: Matrix2D = [1, 0, 0, 1, 0, 0]): Matrix2D =>
  set(new Float32Array(6), initial[0], initial[1], initial[2], initial[3], initial[4], initial[5])

export const clone = (m: Matrix2D) => matrix2D([m[0], m[1], m[2], m[3], m[4], m[5]])

const set = (m: Matrix2D, a: number, b: number, c: number, d: number, e: number, f: number) => {
  m[0] = a
  m[1] = b
  m[2] = c
  m[3] = d
  m[4] = e
  m[5] = f
  return m
}

export const identity = (m: Matrix2D) => set(m, 1, 0, 0, 1, 0, 0)

/**
 * Copy the values from one {@link Matrix2D} to another
 */
export const copy = (m: Matrix2D, a: Matrix2D) => set(m, a[0], a[1], a[2], a[3], a[4], a[5])

/**
 * Inverts a {@link Matrix2D}
 */

export const invert = (m: Matrix2D, source: Matrix2D) => {
  let aa = source[0],
    ab = source[1],
    ac = source[2],
    ad = source[3]
  let atx = source[4],
    aty = source[5]

  let det = aa * ad - ab * ac
  if (!det) {
    return m
  }
  det = 1.0 / det

  return set(
    m,
    ad * det,
    -ab * det,
    -ac * det,
    aa * det,
    (ac * aty - ad * atx) * det,
    (ab * atx - aa * aty) * det
  )
}

/**
 * Calculates the determinant of a {@link Matrix2D}
 */
export const determinant = (m: Matrix2D) => m[0] * m[3] - m[1] * m[2]

/**
 * Multiplies two {@link Matrix2D}s
 */
export const multiply = (m: Matrix2D, a: Matrix2D, b: Matrix2D) =>
  set(
    m,
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5]
  )

/**
 * Rotates a {@link Matrix2D} by the given angle
 */
export const rotate = (m: Matrix2D, a: Matrix2D, rad: number) => {
  let s = sin(rad)
  let c = cos(rad)
  return set(
    m,
    a[0] * c + a[2] * s,
    a[1] * c + a[3] * s,
    a[0] * -s + a[2] * c,
    a[4],
    a[1] * -s + a[3] * c,
    a[5]
  )
}

export const scale = (m: Matrix2D, a: Matrix2D, v: Vector2 | [number, number]) =>
  set(m, a[0] * v[0], a[1] * v[0], a[2] * v[1], a[3] * v[1], a[4], a[5])

export const getScale = (m: Matrix2D) => sqrt(m[0] * m[3])

export const translate = (m: Matrix2D, a: Matrix2D, v: Vector2 | [number, number]) =>
  set(m, a[0], a[1], a[2], a[3], a[0] * v[0] + a[2] * v[1] + a[4], a[1] * v[0] + a[3] * v[1] + a[5])

export const fromRotation = (m: Matrix2D, rad: number) => {
  let s = sin(rad),
    c = cos(rad)

  return set(m, c, s, -s, c, 0, 0)
}
export const fromScaling = (m: Matrix2D, v: Vector2) => set(m, v[0], 0, 0, v[1], 0, 0)

export const fromTranslation = (m: Matrix2D, v: Vector2 | [number, number]) =>
  set(m, 1, 0, 0, 1, v[0], v[1])

export const add = (m: Matrix2D, a: Matrix2D, b: Matrix2D) =>
  set(m, a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5])

export const subtract = (m: Matrix2D, a: Matrix2D, b: Matrix2D) =>
  set(m, a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5])

export const multiplyScalar = (m: Matrix2D, a: Matrix2D, b: number) =>
  set(m, a[0] * b, a[1] * b, a[2] * b, a[3] * b, a[4] * b, a[5] * b)

export const equals = (m: Matrix2D, a: Matrix2D) =>
  abs(m[0] - a[0]) <= EPS * max(1.0, abs(m[0]), abs(a[0])) &&
  abs(m[1] - a[1]) <= EPS * max(1.0, abs(m[1]), abs(a[1])) &&
  abs(m[2] - a[2]) <= EPS * max(1.0, abs(m[2]), abs(a[2])) &&
  abs(m[3] - a[3]) <= EPS * max(1.0, abs(m[3]), abs(a[3])) &&
  abs(m[4] - a[4]) <= EPS * max(1.0, abs(m[4]), abs(a[4])) &&
  abs(m[5] - a[5]) <= EPS * max(1.0, abs(m[5]), abs(a[5]))
