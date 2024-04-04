import { type LocalStorageOptions, signal, persist } from '..'
import { useWritableSignal } from './use-state.svelte'

export const usePersistedSignal = <T>({ defaultValue, ...options }: LocalStorageOptions<T>) =>
  useWritableSignal(persist(signal(defaultValue), options))
