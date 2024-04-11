import { type LocalStorageOptions, signal, persist } from '..'
import { useSubscribable } from './use-state.vue'

export const usePersistedSignal = <T>({ defaultValue, ...options }: LocalStorageOptions<T>) =>
  useSubscribable(persist(signal(defaultValue), options))
