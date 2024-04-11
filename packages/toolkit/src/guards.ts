export const isBoolean = (n: unknown): n is boolean => typeof n === 'boolean'

export const isNotNullish = <T = any>(val?: T | null | undefined): val is T => val !== null

export const isString = (n: unknown): n is string => typeof n === 'string'

export const isNumber = (n: unknown): n is number => !isNaN(n as number) && typeof n === 'number'

export const isObject = (n: unknown): n is object => typeof n === 'object' && n !== null

export const isArray = (n: unknown): n is unknown[] => Array.isArray(n)

export const isMap = <K, V>(n: unknown): n is Map<K, V> => n instanceof Map

export const isWeakMap = <K extends object, V>(n: unknown): n is WeakMap<K, V> =>
  n instanceof WeakMap

export const isFloat32Array = (n: unknown): n is Float32Array => n instanceof Float32Array

export const isInt32Array = (n: unknown): n is Int32Array => n instanceof Int32Array

export const isUint32Array = (n: unknown): n is Uint32Array => n instanceof Uint32Array

export const isUint8Array = (n: unknown): n is Uint8Array => n instanceof Uint8Array

export const isUint8ClampedArray = (n: unknown): n is Uint8ClampedArray =>
  n instanceof Uint8ClampedArray

export const isBigInt64Array = (n: unknown): n is BigInt64Array => n instanceof BigInt64Array

export const isBigUint64Array = (n: unknown): n is BigUint64Array => n instanceof BigUint64Array

export const isSymbol = (n: unknown): n is symbol => typeof n === 'symbol'

export const isFunction = (n: unknown): n is Function => typeof n === 'function'

export const isAsyncFunction = (n: unknown): n is Function =>
  isFunction(n) && n.constructor.name === 'AsyncFunction'

export const isSet = <T>(n: unknown): n is Set<T> => n instanceof Set

export const isValidURL = (n: unknown): n is string => {
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
