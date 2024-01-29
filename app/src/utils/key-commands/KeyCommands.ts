import { Emitter } from '../emitter/Emitter'
import { tinykeys } from '../libs/tinykeys'

export enum Commands {
  copy,
  cut,
  paste,
  undo,
  redo,
  backspace,
  esc,
  n,
  c,
  s,
  v,
  h
}

export class KeyCommands extends Emitter<typeof Commands> {
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
      Escape: this.key('esc'),
      n: this.key('n'),
      s: this.key('s'),
      v: this.key('v'),
      h: this.key('h'),
      c: this.key('c')
    })
  }

  private key = (key: keyof typeof Commands) => () => this.emit(key, Commands[key])

  public onKeyCommand = this.onMany

  public dispose = () => {
    this.clearListeners()
    this.unsubscribe()
  }
}
