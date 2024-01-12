import { APP_NAME } from '@/types/constants'
import Emittery from 'emittery'

const MESSAGE_EVENT_NAME = 'sync' as const

export class BroadcastChannelSync {
  emitter = new Emittery()
  channel = new BroadcastChannel(APP_NAME)

  constructor() {
    this.channel.onmessage = (event) => {
      this.emitter.emit(MESSAGE_EVENT_NAME, event)
    }
  }

  public sendMessage = (msg: any) => {
    this.channel.postMessage(msg)
  }

  public onMessage = (fn: () => void) => {
    this.emitter.on(MESSAGE_EVENT_NAME, fn)
  }

  public dispose = () => {
    this.channel.close()
    this.emitter.clearListeners()
  }
}
