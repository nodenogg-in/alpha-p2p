import { customRef } from 'vue'
import { getLocalStorage, setLocalStorage, type LocalStorageOptions, signal } from '..'

export const useLocalSignal = <T>({
  name,
  validate,
  defaultValue,
  interval,
  refine
}: LocalStorageOptions<T> & { refine?: (value: T) => T }) => {
  const raw = signal(() => getLocalStorage(name, validate, defaultValue))
  let lastUpdate = performance.now()

  raw.on((newValue: T) => {
    const now = performance.now()
    if (!interval || now - lastUpdate >= interval) {
      raw.set(refine ? refine(newValue) : newValue)
      setLocalStorage(name, raw.get())
      lastUpdate = now
    }
  })

  return customRef<T>((track, trigger) => ({
    get: () => {
      track()
      return raw.get()
    },
    set: (v: T) => {
      trigger()
      raw.set(v)
    },
    dispose: raw.dispose
  }))
}
