import type { Identity } from '../sync/schema'
import { createUuid } from './uuid'

export const createUserIdentity = (): Identity => ({ user_id: createUuid() })
