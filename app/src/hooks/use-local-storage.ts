import { customRef, reactive, watch } from 'vue'
import { type Output } from 'valibot'
import { getLocalStorage, setLocalStorage, type LocalStorageOptions } from '@nodenogg.in/state'

/**
 * An extended version of Vue's ref() that persists the value to local storage,
 * meaning the value will stay the same across sessions and browser refresh.
 */
export const localRef = <T>({
  name,
  validate,
  defaultValue,
  interval,
  refine
}: LocalStorageOptions<T> & { refine?: (value: T) => T }) => {
  return customRef<T>((track, trigger) => {
    let value = getLocalStorage(name, validate, defaultValue())
    let lastUpdate = performance.now()

    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        const now = performance.now()
        if (!interval || now - lastUpdate >= interval) {
          value = refine ? refine(newValue) : newValue
          setLocalStorage(name, value)
          lastUpdate = now
          trigger()
        }
      }
    }
  })
}

/**
 * An extended version of Vue's reactive() that persists the value to local storage,
 * meaning the value will stay the same across sessions and browser refresh.
 */
export const localReactive = <T extends object>({
  name,
  validate,
  defaultValue,
  interval
}: LocalStorageOptions<T>) => {
  const value = getLocalStorage(name, validate, defaultValue())
  const ref = reactive<T>(value)
  let lastUpdate = performance.now()

  // Watch our reactive value and persist changes to local storage
  watch(
    ref,
    (newValue) => {
      const now = performance.now()
      if (!interval || now - lastUpdate >= interval) {
        setLocalStorage(name, newValue)
        lastUpdate = now
      }
    },
    { flush: 'post' }
  )

  return ref
}
