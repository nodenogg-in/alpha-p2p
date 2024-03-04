import { boolean, object } from 'valibot'
import { Keyboard } from './state/Keyboard'
import { NetworkState } from './state/NetworkState'
import { WindowState } from './state/WindowState'
import { getPersistenceName } from './create-app'
import { State } from '../utils'
import { allowEvent } from '../utils/pointer-events'

export class UIState extends State<{ menuOpen: boolean; filterEvents: boolean }> {
  readonly keyboard = new Keyboard()
  readonly network = new NetworkState()
  readonly window = new WindowState({
    filterEvents: (e) => {
      if (!allowEvent(e) && this.getKey('filterEvents')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })

  constructor() {
    super({
      initial: () => ({ menuOpen: true, filterEvents: true }),
      persist: {
        name: getPersistenceName(['ui', 'state']),
        schema: object({
          filterEvents: boolean(),
          menuOpen: boolean()
        })
      }
    })
    this.onDispose(() => {
      this.keyboard.dispose()
      this.window.dispose()
      this.network.dispose()
    })
  }
}