import { type Identity, identitySchema } from '../../schema'
import { createUserId } from '../../utils'
import { getPersistenceName } from '../create-app'
import { MicroState } from '../../utils/emitter/MicroState'

export class UserState extends MicroState<Identity> {
  constructor() {
    super(() => ({ user_id: createUserId() }), {
      name: getPersistenceName(['app', 'identity']),
      schema: identitySchema
    })
  }
}
