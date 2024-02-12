import type { Identity } from '../schema/schema'
import { createUuid } from './uuid'

export const createUserIdentity = (): Identity => ({ user_id: createUuid() })
