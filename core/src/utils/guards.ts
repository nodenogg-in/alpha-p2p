import { is, number, string } from 'valibot'

export const isString = (n: unknown): n is string => is(string(), n)

export const isNumber = (n: unknown): n is number => is(number(), n)

export const isObject = (n: unknown): n is object => typeof n === 'object' && n !== null

export const isArray = <T>(n: T | T[]): n is T[] => Array.isArray(n)

export const isMap = <K, V>(n: unknown): n is Map<K, V> => n instanceof Map

export const isFunction = (n: unknown): n is Function => typeof n === 'function'

export const isSet = <T>(n: unknown): n is Set<T> => n instanceof Set
