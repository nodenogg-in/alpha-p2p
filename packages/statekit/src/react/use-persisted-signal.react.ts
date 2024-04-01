import { getLocalStorage, setLocalStorage, type LocalStorageOptions, signal } from '..'
import { useSignal } from './use-state.react'

export const usePersistedSignal = <T>({
  name,
  validate,
  defaultValue,
  interval,
  refine
}: LocalStorageOptions<T> & { refine?: (value: T) => T }): [T, (update: T) => void] => {
  const raw = signal(() => getLocalStorage(name, validate, defaultValue))
  let lastUpdate = performance.now()

  const set = (newValue: T) => {
    const now = performance.now()
    if (!interval || now - lastUpdate >= interval) {
      raw.set(refine ? refine(newValue) : newValue)
      setLocalStorage(name, raw.get())
      lastUpdate = now
    }
  }

  const state = useSignal(raw)

  return [state, set]
}
