import { customRef } from 'vue'

export const useRefineRef = <T>(value: T, refine: (value: T) => T) => {
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = refine(newValue)
        trigger()
      }
    }
  })
}
