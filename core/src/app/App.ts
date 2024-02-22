import { object } from 'valibot'
import { identitySchema } from '../schema'
import { IdentityState, createUserIdentity } from './state/IdentityState'
import { Keyboard } from './state/Keyboard'
import { NetworkState } from './state/NetworkState'
import { WindowState } from './state/WindowState'
import { APP_NAME, SCHEMA_VERSION } from '../sync'

export const getPersistenceName = (...name: string[]) => [
  APP_NAME,
  SCHEMA_VERSION.toString(),
  ...name
]

export class App {
  readonly schema: number = SCHEMA_VERSION
  readonly keyboard = new Keyboard()
  readonly window = new WindowState()
  readonly network = new NetworkState()
  readonly user = new IdentityState({
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
