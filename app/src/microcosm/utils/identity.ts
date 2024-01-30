import type { Identity } from '../types/schema'
import { createUuid } from './uuid'

export const createUserIdentity = (): Identity => ({ user_id: createUuid() })
