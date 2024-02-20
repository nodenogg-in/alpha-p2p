import { Emitter } from '../utils/emitter/Emitter'
import { tinykeys } from './lib/tinykeys'

export enum Commands {
  copy,
  cut,
  paste,
  undo,
  redo,
  backspace,
  escape,
  n,
  c,
  m,
  v,
  h
}

export class UIKeyCommands extends Emitter<typeof Commands> {
  public emitPublic = this.emit
  private unsubscribe: () => void

  constructor() {
    super()
    this.unsubscribe = tinykeys(window, {
      '$mod+C': this.key('copy'),
      '$mod+X': this.key('cut'),
      '$mod+V': this.key('paste'),
      '$mod+Shift+Z': this.key('redo'),
      '$mod+Z': this.key('undo'),
      Backspace: this.key('backspace'),
      Escape: this.key('escape'),
      n: this.key('n'),
      m: this.key('m'),
      v: this.key('v'),
      h: this.key('h'),
      c: this.key('c')
    })
  }

  private key = (key: keyof typeof Commands) => () => this.emit(key, Commands[key])

  public dispose = () => {
    this.clearListeners()
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

export type OnKeyCommand = UIKeyCommands['onMany']
