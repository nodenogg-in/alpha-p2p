import { type Identity, identitySchema } from '../../schema'
import { createUserId } from '../../utils'
import { getPersistenceName } from '../create-app'
import { State } from '../../utils'

export class UserState extends State<Identity> {
  constructor() {
    super({
      initial: () => ({ user_id: createUserId() }),
      persist: {
        name: getPersistenceName(['app', 'identity']),
        schema: identitySchema
      }
    })
  }
}
