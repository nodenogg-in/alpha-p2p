import { type PersistenceName, State, signal } from '@figureland/statekit'
import { boolean, is, object } from 'valibot'
import { Keyboard } from './Keyboard'
import { Device } from './Device'
import { Screen } from './Screen'
import { allowEvent } from './pointer-events'
import { FileDrop } from './FileDrop'
import { VALID_IMPORT_FORMATS, MAX_FILE_SIZE } from '@nodenogg.in/io'

export type UIState = {
  menuOpen: boolean
  showUI: boolean
}

export class UI extends State<UIState> {
  readonly filterEvents = signal(() => true)
  
  readonly keyboard = new Keyboard()
  readonly device = new Device()
  readonly filedrop = new FileDrop([...VALID_IMPORT_FORMATS], MAX_FILE_SIZE)
  readonly screen = new Screen({
    filterEvents: (e) => {
      if (!allowEvent(e) && this.filterEvents.get()) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })

  constructor(persistenceName?: PersistenceName) {
    super({
      initial: () => ({
        menuOpen: true,
        showUI: true
      }),
      persistence: persistenceName && {
        name: persistenceName,
        validate: (v) =>
          is(
            object({
              menuOpen: boolean(),
              showUI: boolean()
            }),
            v
          )
      }
    })

    this.use(
      this.keyboard.events.onMany({
        m: this.toggleMenu,
        backslash: this.toggleUI
      }),
      this.filedrop.dispose,
      this.keyboard.dispose,
      this.screen.dispose,
      this.device.dispose
    )
  }

  public toggleMenu = () => {
    this.key('menuOpen').set((menuOpen) => !menuOpen)
  }
  public toggleUI = () => {
    this.key('showUI').set((showUI) => !showUI)
  }
}
