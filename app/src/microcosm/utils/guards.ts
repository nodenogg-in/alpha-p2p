import { is, number, string } from 'valibot'

export const isString = (n: unknown): n is string => is(string(), n)

export const isNumber = (n: unknown): n is number => is(number(), n)
