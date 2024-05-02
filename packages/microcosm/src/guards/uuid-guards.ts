import { isString } from '@figureland/typekit/guards'
import {
  MAX_LENGTH,
  MIN_LENGTH,
  type IdentityID,
  type MicrocosmID,
  type NodeID
} from '../operations/uuid'

export const isValidIdentityID = (input: unknown): input is IdentityID =>
  isString(input) && input.startsWith('identity_') && input.length === 45

export const isValidNodeID = (input: unknown): input is NodeID =>
  isString(input) && input.startsWith('node_') && input.length === 41

export const isValidMicrocosmID = (input: unknown): input is MicrocosmID => {
  return (
    isString(input) &&
    /^[a-z0-9]+\_[a-z0-9]+$/i.test(input) &&
    input.length >= MIN_LENGTH &&
    input.length <= MAX_LENGTH
  )
}
