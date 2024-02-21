import { isFunction } from '../guards'
import { Emitter } from './Emitter'

export type SimpleObject = {
  [key: string]: SimplePrimitive
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
export type StateStore = Record<Exclude<string, 'state'>, SimpleState>

export class State<
  T extends StateStore,
  K extends string & keyof T = string & keyof T
> extends Emitter<T> {
  private _state: T

  constructor(defaultState: () => T) {
    super()
    this.state = defaultState()
  }

  public get state() {
    return this._state
  }

  private set state(state: T) {
    this._state = state
  }

  public subscribe = (fn: (state: T) => void) => this.on('state', () => fn(this.state))

  public get = <Key extends keyof T = K, P extends T = T>(key: Key) => this.state[key] as P[Key]

  private requestUpdate = (key: string & keyof T) => {
    this.emit(key, this.state[key])
    this.emit('state', this.state as any)
  }

  public set = (key: K, update: Partial<T[K]> | ((s: T[K]) => T[K])) => {
    if (isFunction(update)) {
      this.state[key] = { ...this.state[key], ...update(this.state[key]) }
    } else {
      this.state[key] = { ...this.state[key], ...update }
    }
    requestAnimationFrame(() => this.requestUpdate(key))
  }
}
