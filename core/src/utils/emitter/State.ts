import type { BaseSchema } from 'valibot'
import { isFunction } from '../guards'
import { getLocalStorage, setLocalStorage } from '../local-storage'
import { Emitter } from './Emitter'
import { Unsubscribe } from '../../schema'

export type StateObject = {
  [key: string | number]: StatePrimitive
}
export type StateMap = Map<string, StatePrimitive>
export type StateSet = Set<StatePrimitive>
export type StateArray = Array<StatePrimitive>

export type StatePrimitive =
  | null
  | string
  | number
  | boolean
  | StateMap
  | StateArray
  | StateObject
  | StateSet

export type StateRecord = Record<string, StatePrimitive>
export type StateStore = Record<string, StateRecord>

type PersistenceOptions<S extends StateStore> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

export type StateConfig<S extends StateStore> = {
  initial: () => S
  persist?: PersistenceOptions<S>
}

export class State<
  S extends StateStore,
  K extends string & keyof S = string & keyof S
> extends Emitter<S> {
  protected _state!: S
  protected persist!: PersistenceOptions<S>
  protected lastUpdate: number = performance.now()
  protected subscriptions: Unsubscribe[] = []

  constructor({ initial, persist }: StateConfig<S>) {
    super()
    if (persist) {
      this.persist = persist
      this.state = getLocalStorage(this.persist.name, this.persist.schema, initial())
    } else {
      this.state = initial()
    }
  }

  protected persistState = () => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, this.state)
      this.lastUpdate = now
    }
  }

  public get state() {
    return this._state
  }

  protected set state(state: S) {
    this._state = state
  }

  public get = <Key extends K = K>(key: Key) => this.state[key]

  protected requestUpdate = (key: K) => this.emit(key, this.get(key))

  public set = (key: K, update: Partial<S[K]> | ((s: S[K]) => S[K]), emit: boolean = true) => {
    if (isFunction(update)) {
      this.state[key] = {
        ...this.state[key],
        ...update(this.get(key))
      }
    } else {
      this.state[key] = {
        ...this.state[key],
        ...update
      }
    }
    if (this.persist) requestAnimationFrame(this.persistState)
    if (emit) requestAnimationFrame(() => this.requestUpdate(key))
  }

  public dispose = () => {
    this.clearListeners()
    for (const sub of this.subscriptions) {
      sub()
    }
  }
}

export const useStateEvent = <ES extends StateStore, EK extends string & keyof ES>(
  state: State<ES>,
  name: EK,
  onChange: (value: ES[EK]) => void
): Unsubscribe => {
  const handler = (newState: ES[EK]) => {
    onChange(newState)
  }
  state.on(name, handler)
  return () => {
    state.off(name, handler)
  }
}
