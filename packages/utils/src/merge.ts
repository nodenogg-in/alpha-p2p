import { deepmergeCustom } from 'deepmerge-ts'
import { isObject } from './guards'

export type Merge<T extends any = any, U extends T | Partial<T> = T> = (s: T, u: U) => T

const mergeFn = deepmergeCustom({ mergeArrays: false })

export const deepMerge: Merge = (o, u) => (isObject(o) ? mergeFn(o, u) : u)

export const simpleMerge: Merge = (o, u) => ({ ...o, ...u })
