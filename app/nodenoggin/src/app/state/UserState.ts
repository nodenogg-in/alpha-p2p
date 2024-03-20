import { object } from 'valibot'
import { Identity, identitySchema } from '../../schema'
import { State, createUserId } from '../../utils'
import { getPersistenceName } from '../UI'

export class UserState extends State<{ identity: Identity }> {
  constructor() {
    super({
      initial: () => ({
        identity: { user_id: createUserId() }
      }),
      persist: {
        name: getPersistenceName('app', 'identity'),
        schema: object({
          identity: identitySchema
        })
      }
    })
  }
}
