import { type StoreApi, createStore } from 'zustand/vanilla'
import { deepmerge } from 'deepmerge-ts'
import type { Unsubscribe } from '../../schema'
import { BaseSchema } from 'valibot'
import { getLocalStorage, setLocalStorage } from '../local-storage'

type PersistenceOptions<S extends object> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

type PartialStoreUpdate<S extends object, K extends string & keyof S = string & keyof S> = (
  state: S[K],
  prevState?: S[K]
) => Partial<S[K]>

export interface State<
  S extends object,
  K extends string & keyof S = string & keyof S,
  SU extends PartialStoreUpdate<S, K> = PartialStoreUpdate<S, K>
> {
  set: (fn: (store: S) => Partial<S>) => void
  get: () => S
  getKey: <Key extends K = K>(key: Key) => S[Key]
  setKey: <Key extends K = K>(key: Key, update: SU) => void
  onKey: <Key extends K = K>(sub: Key, handler: SU) => void
  on: (sub: (value: S, prev?: S) => void) => void
  clearListeners: () => void
}

export class MicroState<
  S extends object,
  K extends string & keyof S = string & keyof S,
  SU extends PartialStoreUpdate<S, K> = PartialStoreUpdate<S, K>
> implements State<S, K, SU>
{
  private store: StoreApi<S>
  private listeners: Unsubscribe[] = []
  private persist: PersistenceOptions<S>
  private lastUpdate: number = performance.now()

  constructor(initialState: () => S, persist?: PersistenceOptions<S>) {
    if (persist) {
      this.persist = persist
      const initialStateFromStorage = getLocalStorage(
        this.persist.name,
        this.persist.schema,
        initialState()
      )
      this.store = createStore(() => initialStateFromStorage)
    } else {
      this.store = createStore(initialState)
    }
  }

  protected persistState = () => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, this.get())
      this.lastUpdate = now
    }
  }

  public set = (fn: (store: S) => Partial<S>) => {
    const update = fn(this.store.getState())
    this.store.setState(() => ({
      ...this.get(),
      ...update
    }))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public get = (): S => this.store.getState()

  public getKey = <Key extends K = K>(key: Key) => this.get()[key]

  public setKey = <Key extends K = K>(key: Key, update: SU) => {
    const target = this.getKey(key)
    const updated = update(target)
    this.store.setState((s) => ({
      ...s,
      [key]: deepmerge(target, updated)
    }))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public onKey = <Key extends K = K>(sub: Key, handler: (data: S[Key], prev: S[Key]) => void) => {
    this.listeners.push(
      this.store.subscribe((state, prevState) => {
        handler(state[sub], prevState[sub])
      })
    )
  }

  public on = (sub: (value: S, prev?: S) => void) => {
    this.listeners.push(
      this.store.subscribe((state, prevState) => {
        sub(state, prevState)
      })
    )
  }

  public clearListeners = () => {
    for (const unsubscribe of this.listeners) {
      unsubscribe()
    }
  }
}
