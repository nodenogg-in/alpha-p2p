export type Merge<T extends any = any, U extends T | Partial<T> = T> = (s: T, u: U) => T

export const simpleMerge: Merge = (o, u) => ({ ...o, ...u })
