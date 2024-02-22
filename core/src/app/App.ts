import { object } from 'valibot'
import { Identity, identitySchema } from '../schema'
import { Keyboard } from './state/Keyboard'
import { NetworkState } from './state/NetworkState'
import { WindowState } from './state/WindowState'
import { APP_NAME, SCHEMA_VERSION } from '../sync'
import { State, createUserId } from '../utils'

export const getPersistenceName = (...name: string[]) => [
  APP_NAME,
  SCHEMA_VERSION.toString(),
  ...name
]

const createUserIdentity = (): Identity => ({ user_id: createUserId() })

export class App {
  readonly schema: number = SCHEMA_VERSION
  readonly keyboard = new Keyboard()
  readonly window = new WindowState()
  readonly network = new NetworkState()
  readonly user = new State({
    initial: () => ({
      identity: createUserIdentity()
    }),
    persist: {
      name: getPersistenceName('app', 'identity'),
      schema: object({
        identity: identitySchema
      })
    }
  })

  public dispose = () => {
    this.keyboard.dispose()
    this.window.dispose()
    this.network.dispose()
    this.user.dispose()
  }
}
