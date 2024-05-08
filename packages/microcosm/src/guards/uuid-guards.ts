import { isString } from '@figureland/typekit/guards'
import { MAX_LENGTH, MIN_LENGTH } from '../operations/uuid'
import type { EntityID, IdentityID, MicrocosmID } from '../schema/uuid.schema'

export const isValidIdentityID = (input: unknown): input is IdentityID =>
  isString(input) && input.startsWith('@') && input.length === 37

export const isValidEntityID = (input: unknown): input is EntityID =>
  isString(input) && input.startsWith('e_') && input.length === 38

export const isValidMicrocosmID = (input: unknown): input is MicrocosmID =>
  isString(input) &&
  /^[a-z0-9]+\_[a-z0-9]+$/i.test(input) &&
  input.length >= MIN_LENGTH &&
  input.length <= MAX_LENGTH
