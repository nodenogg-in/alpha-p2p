import {
  intersect,
  literal,
  object,
  partial,
  type Input,
  variant,
  enum_,
  pick,
  string
} from 'valibot'
import { identitySchema, nodeContentSchema, nodeSchema } from './schema'

// Create action

const requiredFields = pick(nodeSchema, ['id', 'user_id', 'signature', 'updated'])

export const CREATE_ACTION_NAME = 'create' as const

export const createNodeActionSchema = object({
  type: literal(CREATE_ACTION_NAME),
  data: nodeSchema
})

export type CreateNodeAction = Input<typeof createNodeActionSchema>

export const makeCreateNodeAction = (data: CreateNodeAction['data']): CreateNodeAction => ({
  type: CREATE_ACTION_NAME,
  data
})
// Update action

export const UPDATE_ACTION_NAME = 'update' as const

export const updateNodeActionSchema = object({
  type: literal(UPDATE_ACTION_NAME),
  data: intersect([
    requiredFields,
    object({
      content: partial(nodeContentSchema)
    })
  ])
})

export type UpdateNodeAction = Input<typeof updateNodeActionSchema>

export const makeUpdateNodeAction = (data: UpdateNodeAction['data']): UpdateNodeAction => ({
  type: UPDATE_ACTION_NAME,
  data
})

// Remove action

export const REMOVE_ACTION_NAME = 'remove' as const

export const removeNodeActionSchema = object({
  type: literal(REMOVE_ACTION_NAME),
  data: requiredFields
})

export type RemoveNodeAction = Input<typeof removeNodeActionSchema>

export const makeRemoveNodeAction = (data: RemoveNodeAction['data']): RemoveNodeAction => ({
  type: REMOVE_ACTION_NAME,
  data
})

// Identity action

export const IDENTITY_ACTION_NAME = 'identify' as const

export enum IDENTITY_STATUS {
  Join = 'join',
  Leave = 'leave'
}

export const identityActionSchema = object({
  type: literal(IDENTITY_ACTION_NAME),
  data: intersect([
    identitySchema,
    object({
      status: enum_(IDENTITY_STATUS)
    })
  ])
})

export type IdentityAction = Input<typeof identityActionSchema>

export const makeIdentityAction = (data: IdentityAction['data']): IdentityAction => ({
  type: IDENTITY_ACTION_NAME,
  data
})

// Node action variants

export const nodeActionSchema = variant('type', [
  createNodeActionSchema,
  removeNodeActionSchema,
  updateNodeActionSchema,
  identityActionSchema
])

export type Action = Input<typeof nodeActionSchema>
