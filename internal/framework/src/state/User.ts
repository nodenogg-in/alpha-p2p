import { State } from '@nodenogg.in/statekit'
import { is } from 'valibot'
import { type Identity, createIdentityUID, identitySchema } from '@nodenogg.in/microcosm'
import { getPersistenceName } from '../create-app'

export class User extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ identity_uid: createIdentityUID(), username: undefined }),
      persist: {
        name: getPersistenceName(['identity']),
        validate: (v) => is(identitySchema, v)
      }
    })
  }
}
