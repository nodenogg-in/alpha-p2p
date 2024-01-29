export type Color = [number, number, number]
import * as keys from './colors'
// Helper to allow view names to be typed
export type ColorName = keyof typeof keys

export const neutral: Color = [47, 26, 94]
export const red: Color = [0, 100, 68]
export const orange: Color = [18, 100, 67]
export const yellow: Color = [40, 100, 64]
export const green: Color = [86, 66, 55]
export const blue: Color = [223, 100, 74]
export const purple: Color = [256, 96, 73]
export const pink: Color = [335, 79, 69]
export const turquoise: Color = [162, 60, 64]
export const putty: Color = [79, 15, 68]
