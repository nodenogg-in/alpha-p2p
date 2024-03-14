import { deepEqual as deepEqualFn } from 'fast-equals'
import { keys } from '../../utils/src/object'
import * as equals from './equals'

export type Equality = keyof typeof equals

export type Equals = (s: unknown, t: unknown) => boolean

export const basic: Equals = (state, prevState) => Object.is(state, prevState)

export const shallow: Equals = (obj1, obj2) => {
  if (basic(obj1, obj2)) {
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

export const deep: Equals = deepEqualFn
