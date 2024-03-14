import { Instance } from '..'
import { type Identity, identitySchema } from '../../schema'
import { createUserId } from '../../utils'
import { State } from '../../utils/State'

export class User extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ user_id: createUserId() }),
      persist: {
        name: Instance.getPersistenceName(['identity']),
        schema: identitySchema
      }
    })
  }
}
