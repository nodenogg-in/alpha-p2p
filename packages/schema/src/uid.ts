import { isString } from '@figureland/kit/tools'
import { Schema } from 'effect'

const validateUID = (uid: number[]) => {
  return uid.length === 10 || 'uid must be 10 characters long'
}

export const MIN_LENGTH = 16
export const MAX_LENGTH = 60

type MicrocosmUID = string

export const isValidMicrocosmID = (input: unknown): input is MicrocosmUID =>
  isString(input) &&
  /^[0-9A-Za-z]+\_[0-9A-Za-z]+$/i.test(input) &&
  input.length >= MIN_LENGTH &&
  input.length <= MAX_LENGTH

const MicrocosmID = Schema.String.pipe(isValidMicrocosmID)
