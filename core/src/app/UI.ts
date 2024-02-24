import { boolean, object } from 'valibot'
import { Keyboard } from './state/Keyboard'
import { NetworkState } from './state/NetworkState'
import { WindowState } from './state/WindowState'
import { APP_NAME, SCHEMA_VERSION } from '../sync'
import { State } from '../utils'

export const getPersistenceName = (...name: string[]) => [UI.appName, UI.schema.toString(), ...name]

export class UI extends State<{ state: { menuOpen: boolean } }> {
  static appName: string = APP_NAME
  static schema: number = SCHEMA_VERSION

  readonly keyboard = new Keyboard()
  readonly window = new WindowState()
  readonly network = new NetworkState()

  constructor() {
    super({
      initial: () => ({
        state: {
          menuOpen: false
        }
      }),
      persist: {
        name: getPersistenceName('ui', 'state'),
        schema: object({
          state: object({
            menuOpen: boolean()
          })
        })
      }
    })
  }

  public dispose = () => {
    this.keyboard.dispose()
    this.window.dispose()
    this.network.dispose()
  }
}
