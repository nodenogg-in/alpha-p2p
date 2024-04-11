export const { min, max, abs, sign, round, sqrt, sin, cos, ceil, floor, acos, tan } = Math

export const log = (n: number, a?: number) => Math.log(n) / (a ? Math.log(a) : 1)

/**
 * Return a number constrained between lower and upper bounds.
 *
 * @param value - Input value to constrain
 * @param low - Lower bound
 * @param high - Upper bound
 * @returns Number clamped between `x` and `y`
 *
 */
export const clamp = (value: number, low: number, high: number = Infinity): number =>
  min(max(value, low), high)

/**
 * Return a number mapped from one input range to another
 *
 * @param value - Input value to constraint
 * @param low1 - Lower bound for input value range
 * @param high1 - Upper bound for input value range
 * @param low2 - Lower bound for output range
 * @param high2 - Upper bound for output range
 * @returns Number
 *
 */
export const mapRange = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
): number => low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)

/**
 * Return a number interpolated between a range
 *
 * @param From - From value
 * @param to - To value
 * @param amount - Amount (usually from 0.0 to 1.0) for interpolation
 * @returns Number
 *
 */
export const lerp = (from: number, to: number, amount: number): number =>
  from * (1.0 - amount) + to * amount

export const dp = (n: any, dp: number): number => Number(n.toFixed(dp))
