import { deepmergeCustom, deepmergeIntoCustom } from 'deepmerge-ts'
import { isObject } from './guards'

const mergeIntoFn = deepmergeIntoCustom({ mergeArrays: false })

export const mergeInto = <T extends object, U extends T | Partial<T>>(s: T, u: U) => {
  mergeIntoFn(s, u)
}

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
