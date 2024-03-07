import { Identity, identitySchema } from '../../schema'
import { State, createUserId } from '../../utils'
import { getPersistenceName } from '../create-app'

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
