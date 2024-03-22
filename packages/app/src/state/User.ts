import { State } from '@nodenogg.in/state'
import { Instance } from '../Instance'
import { is } from 'valibot'
import { type Identity, createIdentityID, identitySchema } from '@nodenogg.in/microcosm'

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
