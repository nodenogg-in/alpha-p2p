import { Emitter } from './Emitter'
import { tinykeys } from './libs/tinykeys'

type Events = {
  copy: KeyboardEvent
  cut: KeyboardEvent
  paste: KeyboardEvent
}

export class Keybindings extends Emitter<Events> {
  unsubscribe!: () => void

  public init = () => {
    this.unsubscribe = tinykeys(window, {
      '$mod+C': (e) => {
        this.emit('copy', e)
      },
      '$mod+V': (e) => {
        this.emit('copy', e)
      },
      '$mod+X': (e) => {
        this.emit('cut', e)
      }
    })
  }

  public dispose = () => {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    this.clearListeners()
  }
}
