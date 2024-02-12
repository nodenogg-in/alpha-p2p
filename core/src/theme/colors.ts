export type HSLColor = [number, number, number]
import * as keys from './colors'
// Helper to allow view names to be typed
export type ColorName = keyof typeof keys

export const neutral: HSLColor = [47, 26, 94]
export const red: HSLColor = [0, 100, 68]
export const orange: HSLColor = [18, 100, 67]
export const yellow: HSLColor = [40, 100, 64]
export const green: HSLColor = [86, 66, 55]
export const blue: HSLColor = [223, 100, 74]
export const purple: HSLColor = [256, 96, 73]
export const pink: HSLColor = [335, 79, 69]
export const turquoise: HSLColor = [162, 60, 64]
export const putty: HSLColor = [79, 15, 68]
