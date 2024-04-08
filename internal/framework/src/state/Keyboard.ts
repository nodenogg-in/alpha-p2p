import { createEvents, type Unsubscribe } from '@nodenogg.in/statekit'
import { preventEvents } from './pointer-events'
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
  command,
  n,
  c,
  m,
  v,
  h,
  j,
  r,
  save,
  space,
  zoomReset,
  zoomIn,
  zoomOut
}

export class Keyboard {
  public readonly events = createEvents<typeof Commands>()
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
      '$mod+K': this.key('command'),
      '$mod+S': this.key('save'),
      Space: this.key('space'),
      Backspace: this.key('backspace'),
      Escape: this.key('escape'),
      n: this.key('n'),
      m: this.key('m'),
      v: this.key('v'),
      h: this.key('h'),
      c: this.key('c'),
      j: this.key('j'),
      r: this.key('r'),
      'Shift+)': this.key('zoomReset'),
      'Shift++': this.key('zoomIn'),
      'Shift+_': this.key('zoomOut')
    })
  }

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
