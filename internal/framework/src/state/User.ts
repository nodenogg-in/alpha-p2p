import { State } from '@figureland/statekit'
import { is } from 'valibot'
import { type Identity, createIdentityID, identitySchema } from '@nodenogg.in/microcosm'
import { getPersistenceName } from '../create-app'

export class User extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ identityID: createIdentityID(), username: undefined }),
      persistence: {
        name: getPersistenceName(['identity']),
        validate: (v) => is(identitySchema, v)
      }
    })
  }
}
