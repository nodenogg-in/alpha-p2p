import { type LocalStorageOptions, signal, persist } from '..'
import { useSignal } from './use-state.vue'

export const usePersistedSignal = <T>({ defaultValue, ...options }: LocalStorageOptions<T>) =>
  useSignal(persist(signal(defaultValue), options))
