import { Identity } from '../../schema'
import { State, createUserId } from '../../utils'

export const createUserIdentity = (): Identity => ({ user_id: createUserId() })

export class IdentityState extends State<{ identity: Identity }> {}
