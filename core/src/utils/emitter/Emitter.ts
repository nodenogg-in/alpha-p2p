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

  public onMany = <TEventName extends keyof T & string>(
    listeners: Record<TEventName, (eventArg: T[TEventName]) => void>
  ): Unsubscribe => {
    const unsubscribes: UnsubscribeFunction[] = []

    for (const [eventName, handler] of Object.entries(listeners)) {
      const unsubscribe = this.emitter.on(
        eventName as TEventName,
        handler as (eventArg: T[TEventName]) => void
      )
      unsubscribes.push(unsubscribe)
    }

    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe()
      }
    }
  }

  public off = <TEventName extends keyof T & string>(
    eventName: TEventName,
    handler: (eventArg: T[TEventName]) => void
  ) => {
    this.emitter.off(eventName, handler)
  }

  protected clearListeners = () => this.emitter.clearListeners()
}
