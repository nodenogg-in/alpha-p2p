import { State } from '@nodenogg.in/state'
import { Instance } from '../Instance'
import { type Identity, identitySchema } from '@nodenogg.in/schema'
import { createUserId } from '../../api/utils/uuid'
import { is } from 'valibot'

export class User extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ user_id: createUserId() }),
      persist: {
        name: Instance.getPersistenceName(['identity']),
        validate: (v) => is(identitySchema, v)
      }
    })
  }
}
