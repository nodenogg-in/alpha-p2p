import { State } from '@nodenogg.in/state'
import { Instance } from '..'
import { type Identity, identitySchema } from '../../schema'
import { createUserId } from '../../sync/utils/uuid'

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
