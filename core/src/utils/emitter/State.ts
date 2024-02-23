import { BaseSchema } from 'valibot'
import { isFunction } from '../guards'
import { getLocalStorage, setLocalStorage } from '../local-storage'
import { Emitter } from './Emitter'

export type SimpleObject = {
  [key: string | number]: SimplePrimitive
}
export type SimpleMap = Map<string, SimplePrimitive>
export type SimpleSet = Set<SimplePrimitive>
export type SimpleArray = Array<SimplePrimitive>

export type SimplePrimitive =
  | null
  | string
  | number
  | boolean
  | SimpleMap
  | SimpleArray
  | SimpleObject
  | SimpleSet

export type SimpleState = Record<string, SimplePrimitive>
export type StateStore = Record<string, SimpleState>

type PersistenceOptions<S extends StateStore, K extends keyof S> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

export type StateConfig<S extends StateStore, K extends keyof S> = {
  initial: () => S
  persist?: PersistenceOptions<S, K>
}

export class State<
  S extends StateStore,
  K extends string & keyof S = string & keyof S
> extends Emitter<S> {
  private _state: S
  private persist!: PersistenceOptions<S, K>
  private lastUpdate: number = performance.now()

  constructor({ initial, persist }: StateConfig<S, K>) {
    super()
    if (persist) {
      this.persist = persist
      this.state = getLocalStorage(this.persist.name, this.persist.schema, initial())
    } else {
      this.state = initial()
    }
  }

  private persistState = () => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, this.state)
      this.lastUpdate = now
    }
  }

  public get state() {
    return this._state
  }

  private set state(state: S) {
    this._state = state
  }

  public get = <Key extends K = K>(key: Key) => this.state[key]

  private requestUpdate = (key: K) => this.emit(key, this.get(key))

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
  }
}
