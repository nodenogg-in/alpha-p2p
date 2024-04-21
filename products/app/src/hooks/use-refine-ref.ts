import { customRef } from 'vue'

export const useRefineRef = <T>(value: T, refine: (value: T) => T) =>
  customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      value = refine(newValue)
      trigger()
    }
  }))
