import { boolean, object } from 'valibot'
import { Keyboard } from './Keyboard'
import { Network } from './Network'
import { Screen } from './Screen'
import { State } from '../../utils'
import { allowEvent } from '../../utils/pointer-events'
import { getPersistenceName } from '../Instance'

export type UIState = {
  menuOpen: boolean
  filterEvents: boolean
  showUI: boolean
}

export class UI extends State<UIState> {
  readonly keyboard = new Keyboard()
  readonly network = new Network()
  readonly screen = new Screen({
    filterEvents: (e) => {
      if (!allowEvent(e) && this.getKey('filterEvents')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })

  constructor() {
    super({
      initial: () => ({ menuOpen: true, filterEvents: true, showUI: true }),
      persist: {
        name: getPersistenceName(['ui', 'state']),
        schema: object({
          filterEvents: boolean(),
          menuOpen: boolean(),
          showUI: boolean()
        })
      }
    })

    this.onDispose(
      this.keyboard.onCommand({
        m: this.toggleMenu,
        backslash: this.toggleUI
      })
    )
    this.onDispose(() => {
      this.keyboard.dispose()
      this.screen.dispose()
      this.network.dispose()
    })
  }

  public toggleMenu = () => {
    this.setKey('menuOpen', (menuOpen) => !menuOpen)
  }
  public toggleUI = () => {
    this.setKey('showUI', (showUI) => !showUI)
  }
}
