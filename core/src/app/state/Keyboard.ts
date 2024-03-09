import type { Unsubscribe } from '../../schema'
import { events } from '../../utils/events'
import { preventEvents } from '../../utils/pointer-events'
import { tinykeys } from '../lib/tinykeys'

export enum Commands {
  all,
  copy,
  cut,
  paste,
  backslash,
  undo,
  redo,
  backspace,
  escape,
  n,
  c,
  m,
  v,
  h,
  space
}

export class Keyboard {
  private events = events<typeof Commands>()
  private unsubscribe: Unsubscribe

  constructor() {
    this.unsubscribe = tinykeys(window, {
      '$mod+A': this.key('all'),
      '$mod+C': this.key('copy'),
      '$mod+X': this.key('cut'),
      '$mod+V': this.key('paste'),
      '$mod+\\': this.key('backslash'),
      '$mod+Shift+Z': this.key('redo'),
      '$mod+Z': this.key('undo'),
      Space: this.key('space'),
      Backspace: this.key('backspace'),
      Escape: this.key('escape'),
      n: this.key('n'),
      m: this.key('m'),
      v: this.key('v'),
      h: this.key('h'),
      c: this.key('c')
    })
  }

  public onCommand = this.events.subscribeMany

  private key = (key: keyof typeof Commands) => (e: KeyboardEvent) => {
    preventEvents(e)
    this.events.emit(key, Commands[key])
  }

  public dispose = () => {
    this.events.dispose()
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
