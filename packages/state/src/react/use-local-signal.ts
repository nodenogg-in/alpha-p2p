import { getLocalStorage, setLocalStorage, type LocalStorageOptions, signal } from '..'
import { useSignal } from './use-state'

export const useLocalSignal = <T>({
  name,
  validate,
  defaultValue,
  interval,
  refine
}: LocalStorageOptions<T> & { refine?: (value: T) => T }): [T, (update: T) => void] => {
  const raw = signal(() => getLocalStorage(name, validate, defaultValue))
  const value = useSignal(raw)
  let lastUpdate = performance.now()

  const set = (newValue: T) => {
    const now = performance.now()
    if (!interval || now - lastUpdate >= interval) {
      raw.set(refine ? refine(newValue) : newValue)
      setLocalStorage(name, value)
      lastUpdate = now
    }
  }

  return [value, set]
}
