import { getLocalStorage, setLocalStorage, type LocalStorageOptions, signal } from '..'
import { useWritableSignal } from './use-state.svelte'

export const usePersistedSignal = <T>({
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
      setLocalStorage(name, newValue)
      lastUpdate = now
    }
  })

  return useWritableSignal(raw)
}
