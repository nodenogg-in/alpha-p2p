import { isArray, isMap, isObject, isSet, isString } from './guards'
import type { StateArray, StateMap, StateSet, StateObject } from './emitter/State'

// todo: type safety but this works for now
export const deepAssign = <T extends StateObject>(target: T, update: Partial<T> = {}) => {
  for (const [k, v] of entries(update)) {
    if (isString(v)) {
      target[k] = v
    } else if (isArray(v)) {
      target[k] = [...v] as StateArray as any
    } else if (isObject(v)) {
      if (isMap(v)) {
        target[k] = new Map(v) as StateMap as any
      } else if (isSet(v)) {
        target[k] = new Set(v) as StateSet as any
      } else {
        deepAssign(target[k] as StateObject, v)
      }
    } else {
      target[k] = v as any
    }
  }
}

type ValueOf<T> = T[keyof T]
type Entries<T> = [keyof T, ValueOf<T>][]

export const entries = <T extends object>(obj: T): Entries<T> => Object.entries(obj) as Entries<T>

export const { keys, values } = Object

export const sortMapToArray = <O extends object, K extends keyof O & string>(
  map: Map<string, O>,
  prop: K
): O[] =>
  Array.from(map.values()).sort((a, b) => (a[prop] as string).localeCompare(b[prop] as string))
