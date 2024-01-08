import { array, intersect, literal, object, partial, string, type Input, variant } from 'valibot'
import { identitySchema, nodeSchema } from './schema'

// Create action

export const CREATE_ACTION_NAME = 'create' as const

export const createActionSchema = object({
  type: literal(CREATE_ACTION_NAME),
  data: array(nodeSchema)
})

export type CreateAction = Input<typeof createActionSchema>

export const makeCreateAction = (data: CreateAction['data']): CreateAction => ({
  type: CREATE_ACTION_NAME,
  data
})

// Remove action

export const REMOVE_ACTION_NAME = 'remove' as const

export const removeActionSchema = object({
  type: literal(REMOVE_ACTION_NAME),
  data: array(string())
})

export type RemoveAction = Input<typeof removeActionSchema>

export const makeRemoveAction = (data: RemoveAction['data']): RemoveAction => ({
  type: REMOVE_ACTION_NAME,
  data
})

// Update action

export const UPDATE_ACTION_NAME = 'update' as const

export const updateActionSchema = object({
  type: literal(UPDATE_ACTION_NAME),
  data: array(
    intersect([
      object({
        id: string()
      }),
      partial(nodeSchema)
    ])
  )
})

export type UpdateAction = Input<typeof updateActionSchema>

export const makeUpdateAction = (data: UpdateAction['data']): UpdateAction => ({
  type: UPDATE_ACTION_NAME,
  data
})

// Identity action

export const IDENTITY_ACTION_NAME = 'identity' as const

export const identityActionSchema = object({
  type: literal(IDENTITY_ACTION_NAME),
  data: identitySchema
})

export type IdentityAction = Input<typeof identityActionSchema>

export const makeIdentityAction = (data: IdentityAction['data']): IdentityAction => ({
  type: IDENTITY_ACTION_NAME,
  data
})

// All action variants

export const actionSchema = variant('type', [
  createActionSchema,
  removeActionSchema,
  updateActionSchema,
  identityActionSchema
])

export type Action = Input<typeof actionSchema>
