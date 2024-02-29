import { deepEqual as deepEqualFn } from 'fast-equals'
import { deepmergeCustom } from 'deepmerge-ts'
import { isObject } from './guards'

const mergeFn = deepmergeCustom({ mergeArrays: false })

export const merge = <T extends any, U extends T | Partial<T>>(s: T, u: U): T =>
  isObject(s) ? (mergeFn(s, u) as T) : (u as T)

type ValueOf<T> = T[keyof T]
type Entries<T> = [keyof T, ValueOf<T>][]

export const entries = <T extends object>(obj: T): Entries<T> => Object.entries(obj) as Entries<T>

export const { keys, values } = Object

export const sortMapToArray = <O extends object, K extends keyof O & string>(
  map: Map<string, O>,
  prop: K
): O[] =>
  Array.from(map.values()).sort((a, b) => (a[prop] as string).localeCompare(b[prop] as string))

export type Equals = (s: unknown, t: unknown) => boolean

export const basicEquals: Equals = (state, prevState) => state === prevState

export const shallowEquals: Equals = (obj1, obj2) => {
  if (basicEquals(obj1, obj2)) {
    return true
  }

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  const keys1 = keys(obj1)
  const keys2 = keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

export const deepEqual = deepEqualFn
