import type { Identity_ID, Node_ID } from '@nodenogg.in/schema'
import { nanoid } from 'nanoid'

export const createUuid = (prefix: string, l: number = 18) => `${prefix}_${nanoid(l)}`

export const createIdentityID = (): Identity_ID => createUuid('identity', 36) as Identity_ID

export const createNodeID = (): Node_ID => createUuid('node', 36) as Node_ID

export const createTimestamp = () => Date.now()

export const password = (l: number = 6) => nanoid(l)
