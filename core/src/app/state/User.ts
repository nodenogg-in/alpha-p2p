import { Identity, identitySchema } from '../../schema'
import { createUserId } from '../../utils'
import { State } from '../../utils/State'
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
