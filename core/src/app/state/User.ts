import { Identity, identitySchema } from '../../schema'
import { State, createUserId } from '../../utils'
import { getPersistenceName } from '../Instance'

export class User extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ user_id: createUserId() }),
      persist: {
        name: getPersistenceName(['identity']),
        schema: identitySchema
      }
    })
  }
}
