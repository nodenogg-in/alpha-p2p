export declare const min: (...values: number[]) => number, max: (...values: number[]) => number, abs: (x: number) => number, sign: (x: number) => number, round: (x: number) => number, sqrt: (x: number) => number;
/**
 * Return a number constrained between lower and upper bounds.
 *
 * @param value - Input value to constrain
 * @param low - Lower bound
 * @param high - Upper bound
 * @returns Number clamped between `x` and `y`
 *
 */
export declare const clamp: (value: number, low: number, high?: number) => number;
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
export declare const mapRange: (value: number, low1: number, high1: number, low2: number, high2: number) => number;
/**
 * Return a number interpolated between a range
 *
 * @param From - From value
 * @param to - To value
 * @param amount - Amount (usually from 0.0 to 1.0) for interpolation
 * @returns Number
 *
 */
export declare const lerp: (from: number, to: number, amount: number) => number;
export declare const dp: (n: any, dp: number) => number;
//# sourceMappingURL=number.d.ts.map