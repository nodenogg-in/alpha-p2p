import { type LocalStorageOptions, signal, persist } from '..'
import { useSignal } from './use-state.react'

export const usePersistedSignal = <T>({
  defaultValue,
  ...options
}: LocalStorageOptions<T>): [T, (update: T) => void] => {
  const raw = persist(signal(defaultValue), options)
  const state = useSignal(raw)
  return [state, raw.set]
}
