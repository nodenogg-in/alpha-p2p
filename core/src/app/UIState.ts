import { boolean, object } from 'valibot'
import { Keyboard } from './state/Keyboard'
import { NetworkState } from './state/NetworkState'
import { WindowState } from './state/WindowState'
import { getPersistenceName } from './create-app'
import { State } from '../utils'

export class UIState extends State<{ menuOpen: boolean }> {
  readonly keyboard = new Keyboard()
  readonly window = new WindowState()
  readonly network = new NetworkState()

  constructor() {
    super({
      initial: () => ({ menuOpen: true }),
      persist: {
        name: getPersistenceName(['ui', 'state']),
        schema: object({
          menuOpen: boolean()
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
