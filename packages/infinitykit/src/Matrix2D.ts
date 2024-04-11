import { sin, cos, sqrt } from '@nodenogg.in/toolkit'
import type { Vector2 } from './Vector2'

export const EPS = 0.000001

export type Matrix2D = Float32Array | [number, number, number, number, number, number]

export const matrix2D = (initial: Matrix2D = [1, 0, 0, 1, 0, 0]): Matrix2D =>
  set(new Float32Array(6), initial)

export const clone = (m: Matrix2D) => matrix2D([m[0], m[1], m[2], m[3], m[4], m[5]])

const set = (m: Matrix2D, args: Matrix2D) => {
  m[0] = args[0]
  m[1] = args[1]
  m[2] = args[2]
  m[3] = args[3]
  m[4] = args[4]
  m[5] = args[5]
  return m
}

export const identity = (m: Matrix2D) => set(m, [1, 0, 0, 1, 0, 0])

/**
 * Copy the values from one {@link Matrix2D} to another
 */
export const copy = (m: Matrix2D, a: Matrix2D) => set(m, a)

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

  return set(m, [
    ad * det,
    -ab * det,
    -ac * det,
    aa * det,
    (ac * aty - ad * atx) * det,
    (ab * atx - aa * aty) * det
  ])
}

/**
 * Calculates the determinant of a {@link Matrix2D}
 */
export const determinant = (m: Matrix2D) => m[0] * m[3] - m[1] * m[2]

/**
 * Multiplies two {@link Matrix2D}s
 */
export const multiply = (m: Matrix2D, a: Matrix2D, b: Matrix2D) =>
  set(m, [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5]
  ])

/**
 * Rotates a {@link Matrix2D} by the given angle
 */
export const rotate = (m: Matrix2D, a: Matrix2D, rad: number) => {
  let s = sin(rad)
  let c = cos(rad)
  return set(m, [
    a[0] * c + a[2] * s,
    a[1] * c + a[3] * s,
    a[0] * -s + a[2] * c,
    a[4],
    a[1] * -s + a[3] * c,
    a[5]
  ])
}

export const scale = (m: Matrix2D, a: Matrix2D, v: Vector2 | [number, number]) =>
  set(m, [a[0] * v[0], a[1] * v[0], a[2] * v[1], a[3] * v[1], a[4], a[5]])

export const getGeometricMeanScale = (m: Matrix2D) => sqrt(m[0] * m[3])

export const translate = (m: Matrix2D, a: Matrix2D, v: Vector2 | [number, number]) =>
  set(m, [
    a[0],
    a[1],
    a[2],
    a[3],
    a[0] * v[0] + a[2] * v[1] + a[4],
    a[1] * v[0] + a[3] * v[1] + a[5]
  ])

export const fromRotation = (m: Matrix2D, rad: number) => {
  let s = sin(rad),
    c = cos(rad)

  return set(m, [c, s, -s, c, 0, 0])
}
export const fromScaling = (m: Matrix2D, v: Vector2) => set(m, [v[0], 0, 0, v[1], 0, 0])

export const fromTranslation = (m: Matrix2D, v: Vector2 | [number, number]) =>
  set(m, [1, 0, 0, 1, v[0], v[1]])

export const frobeniusNorm = (m: Matrix2D) =>
  sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2] + m[3] * m[3] + m[4] * m[4] + m[5] * m[5] + 1)

export const add = (m: Matrix2D, a: Matrix2D, b: Matrix2D) =>
  set(m, [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5]])

export const subtract = (m: Matrix2D, a: Matrix2D, b: Matrix2D) =>
  set(m, [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5]])

export const multiplyScalar = (m: Matrix2D, a: Matrix2D, b: number) =>
  set(m, [a[0] * b, a[1] * b, a[2] * b, a[3] * b, a[4] * b, a[5] * b])

export const multiplyScalarAndAdd = (m: Matrix2D, a: Matrix2D, b: Matrix2D, scale: number) =>
  set(m, [
    a[0] + b[0] * scale,
    a[1] + b[1] * scale,
    a[2] + b[2] * scale,
    a[3] + b[3] * scale,
    a[4] + b[4] * scale,
    a[5] + b[5] * scale
  ])

export const exactEquals = (m: Matrix2D, a: Matrix2D) =>
  m[0] === a[0] && m[1] === a[1] && m[2] === a[2] && m[3] === a[3] && m[4] === a[4] && m[5] === a[5]

export const equals = (m: Matrix2D, a: Matrix2D) =>
  Math.abs(m[0] - a[0]) <= EPS * Math.max(1.0, Math.abs(m[0]), Math.abs(a[0])) &&
  Math.abs(m[1] - a[1]) <= EPS * Math.max(1.0, Math.abs(m[1]), Math.abs(a[1])) &&
  Math.abs(m[2] - a[2]) <= EPS * Math.max(1.0, Math.abs(m[2]), Math.abs(a[2])) &&
  Math.abs(m[3] - a[3]) <= EPS * Math.max(1.0, Math.abs(m[3]), Math.abs(a[3])) &&
  Math.abs(m[4] - a[4]) <= EPS * Math.max(1.0, Math.abs(m[4]), Math.abs(a[4])) &&
  Math.abs(m[5] - a[5]) <= EPS * Math.max(1.0, Math.abs(m[5]), Math.abs(a[5]))
