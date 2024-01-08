import { array, intersect, literal, object, partial, string, type Input, variant } from 'valibot'
import { identitySchema, nodeSchema } from './schema'

// Create action

export const CREATE_ACTION_NAME = 'create' as const

export const createActionSchema = object({
  type: literal(CREATE_ACTION_NAME),
  data: array(nodeSchema)
})

export type CreateAction = Input<typeof createActionSchema>

// Remove action

export const REMOVE_ACTION_NAME = 'remove' as const

export const removeActionSchema = object({
  type: literal(REMOVE_ACTION_NAME),
  data: array(string())
})

export type RemoveAction = Input<typeof removeActionSchema>

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

// WIP

export const IDENTITY_ACTION_NAME = 'identity' as const

export const identityActionSchema = object({
  type: literal(IDENTITY_ACTION_NAME),
  data: identitySchema
})

export const actionSchema = variant('type', [
  createActionSchema,
  removeActionSchema,
  updateActionSchema,
  identityActionSchema
])

export type Action = Input<typeof actionSchema>
