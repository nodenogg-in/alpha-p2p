import { is, number, string } from 'valibot'

export const isString = (n: unknown): n is string => is(string(), n)

export const isNumber = (n: unknown): n is number => is(number(), n)

export const isObject = (n: unknown): n is object => typeof n === 'object' && n !== null

export const isArray = <T>(n: T | T[]): n is T[] => Array.isArray(n)
