import { customAlphabet, nanoid } from 'nanoid'

const DEFAULT_LENGTH = 18

const uuidFn = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  DEFAULT_LENGTH
)

export const createAlphanumericUUID = (prefix: string = '', l: number = DEFAULT_LENGTH) =>
  `${prefix ? `${prefix}` : ''}${uuidFn(l)}`

export const createUUID = (prefix: string = '', l: number = DEFAULT_LENGTH) =>
  `${prefix ? `${prefix}` : ''}${nanoid(l)}`

export const isValidUUID = (input: string): boolean => {
  const regex = /^[0-9A-Za-z]+$/
  return regex.test(input)
}
