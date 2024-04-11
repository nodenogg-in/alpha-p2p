import {
  type LocalStorageValidator,
  setLocalStorage,
  getLocalStorage,
  SignalLikeType,
  SignalLike
} from '.'

export type PersistenceName = string[]

export type PersistenceOptions<V extends any = any> = {
  name: PersistenceName
  validate: LocalStorageValidator
  syncTabs?: boolean
  interval?: number
  set?: (s: SignalLike<V>, v: any) => void
}

export const persist = <S extends SignalLike<any>>(
  s: S,
  options: PersistenceOptions<SignalLikeType<S>>
) => {
  let lastUpdate: number = performance.now()
  const existing = getLocalStorage(options.name, options.validate, s.get)
  options.set ? options.set(s, existing) : s.set(existing)

  s.on((state) => {
    const now = performance.now()
    if (!options.interval || now - lastUpdate >= options.interval) {
      setLocalStorage(options.name, state)
      lastUpdate = now
    }
  })
  return s
}
