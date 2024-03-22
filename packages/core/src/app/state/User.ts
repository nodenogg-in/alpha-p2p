import { State } from '@nodenogg.in/smallstate'
import { type Identity, identitySchema } from '@nodenogg.in/schema'
import { Instance } from '../Instance'
import { createIdentityID } from '../../api/utils/uuid'
import { is } from 'valibot'

export class User extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ user_id: createIdentityID() }),
      persist: {
        name: Instance.getPersistenceName(['identity']),
        validate: (v) => is(identitySchema, v)
      }
    })
  }
}
