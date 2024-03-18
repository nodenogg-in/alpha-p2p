import { State } from '@nodenogg.in/state'
import { boolean, is, object } from 'valibot'
import { Keyboard } from './Keyboard'
import { Device } from './Device'
import { Screen } from './Screen'
import { allowEvent } from './pointer-events'
import { Instance } from '../Instance'

export type UIState = {
  menuOpen: boolean
  filterEvents: boolean
  showUI: boolean
}

export class UI extends State<UIState> {
  readonly keyboard = new Keyboard()
  readonly device = new Device()
  readonly screen = new Screen({
    filterEvents: (e) => {
      if (!allowEvent(e) && this.key('filterEvents').get()) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })

  constructor() {
    super({
      initial: () => ({
        menuOpen: true,
        filterEvents: true,
        showUI: true
      }),
      persist: {
        name: Instance.getPersistenceName(['ui', 'state']),
        validate: (v) =>
          is(
            object({
              filterEvents: boolean(),
              menuOpen: boolean(),
              showUI: boolean()
            }),
            v
          )
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
      this.device.dispose()
    })
  }

  public toggleMenu = () => {
    this.key('menuOpen').set((menuOpen) => !menuOpen)
  }
  public toggleUI = () => {
    this.key('showUI').set((showUI) => !showUI)
  }
}
