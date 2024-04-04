import {
  type LocalStorageValidator,
  type Signal,
  type SignalObject,
  setLocalStorage,
  getLocalStorage
} from '.'

export type PersistenceName = string[]

export type PersistenceOptions = {
  name: PersistenceName
  validate: LocalStorageValidator
  syncTabs?: boolean
  interval?: number
}

export const persist = <S extends Signal<any> | SignalObject<any>>(
  s: S,
  options: PersistenceOptions
) => {
  let lastUpdate: number = performance.now()
  s.set(getLocalStorage(options.name, options.validate, s.get))
  s.on((state) => {
    const now = performance.now()
    if (!options.interval || now - lastUpdate >= options.interval) {
      setLocalStorage(options.name, state)
      lastUpdate = now
    }
  })
  return s
}
