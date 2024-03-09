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

export class NiceMap<K, V> extends Map<K, V> {
  public getOrSet = <Value extends V>(key: K, fn: () => Value) => {
    if (this.has(key)) {
      return this.get(key) as Value
    } else {
      const v = fn()
      this.set(key, v)
      return v as Value
    }
  }
}
