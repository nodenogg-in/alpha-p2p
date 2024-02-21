import { isString } from 'lib0/function'
import { isArray, isMap, isObject } from './guards'

export const assign = <T extends object>(target: T, update: Partial<T>): T =>
  Object.assign(target, update)

export const deepAssign = <T extends object>(target: T, update: Partial<T> = {}): T => {
  if (!update) {
    return
  }
  for (const [k, v] of entries(update)) {
    if (isString(v)) {
      target[k] = v
    } else if (isObject(v) && v !== null) {
      if (isArray(v)) {
        target[k] = [...v]
      } else if (isMap(v)) {
        target[k] = new Map(v)
      } else {
        deepAssign(target[k], v)
      }
    } else {
      target[k] = v
    }
  }
}

export const { entries } = Object
