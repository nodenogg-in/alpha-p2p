import { type LocalStorageOptions, signal, persist } from '..'
import { useSubscribable } from './use-state.react'

export const usePersistedSignal = <T>({
  defaultValue,
  ...options
}: LocalStorageOptions<T>): [T, (update: T) => void] => {
  const raw = persist(signal(defaultValue), options)
  const state = useSubscribable(raw)
  return [state, raw.set]
}
