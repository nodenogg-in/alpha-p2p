import { is, number, string } from 'valibot'

export const isBoolean = (n: unknown): n is boolean => typeof n === 'boolean'

export const isNotNullish = <T>(n: T): n is NonNullable<T> => n !== null && n !== undefined

export const isString = (n: unknown): n is string => is(string(), n)

export const isNumber = (n: unknown): n is number => is(number(), n)

export const isObject = (n: unknown): n is object => typeof n === 'object' && n !== null

export const isArray = (n: unknown): n is unknown[] => Array.isArray(n)

export const isMap = <K, V>(n: unknown): n is Map<K, V> => n instanceof Map

export const isFunction = (n: unknown): n is Function => typeof n === 'function'

export const isSet = <T>(n: unknown): n is Set<T> => n instanceof Set

export const isStringURL = (n: unknown): n is string => {
  if (!isString(n)) return false
  try {
    new URL(n)
    return true
  } catch {
    return false
  }
}

export const isNumberLike = (n: unknown): n is number => {
  if (isNumber(n)) return true
  if (isString(n)) return !isNaN(parseFloat(n))
  return false
}
