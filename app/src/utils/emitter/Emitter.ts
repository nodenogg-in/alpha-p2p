import Emittery, { type UnsubscribeFunction } from 'emittery'

export type Unsubscribe = UnsubscribeFunction

export class Emitter<T extends Record<string, any>> {
  private emitter = new Emittery<T>()

  protected emit = <TEventName extends keyof T & string>(
    eventName: TEventName,
    eventArg: T[TEventName]
  ) => {
    this.emitter.emit(eventName, eventArg)
  }

  public on = <TEventName extends keyof T & string>(
    eventName: TEventName,
    handler: (eventArg: T[TEventName]) => void
  ) => {
    this.emitter.on(eventName, handler)
  }

  protected clearListeners = () => this.emitter.clearListeners()
}
