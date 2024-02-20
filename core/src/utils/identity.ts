import type { Identity } from '../schema/core.schema'
import { createUuid } from './uuid'

export const createUserIdentity = (): Identity => ({ user_id: createUuid() })
