import { customRef, reactive, watch } from 'vue'
import { parse as parseJSON, stringify as stringifyJSON } from 'superjson'
import { parse, type BaseSchema, type Output } from 'valibot'

import { version as VERSION, name as NAME } from '../../package.json'

/**
 * An internal helper to create a standardised, cleaner way for creating
 * keys in localStorage
 */
const getLocalStorageName = (n: string[]) => [NAME, VERSION, ...n].join('/')

/**
 * An internal helper to get a typed, valid value from localStorage
 */
const getLocalStorage = <T>(name: string[], schema: BaseSchema<T>, fallback: T): T => {
  try {
    // If nothing exists in localStorage under that name
    if (!localStorage.getItem(getLocalStorageName(name))) {
      // Set the fallback in localStorage anyway
      setLocalStorage(name, fallback)
      throw new Error()
    }
    // Use superjson rather than JSON.parse to support a wider range of variables
    const result = parseJSON(localStorage.getItem(getLocalStorageName(name)) || '')

    // Validate that the stored data in localStorage corresponds to an expected schema
    return parse(schema, result)
  } catch (e) {
    // Return the fallback in case of any errors
    return fallback
  }
}

/**
 * An internal helper to store a variable in localStorage
 */
const setLocalStorage = (name: string[], value: unknown): void =>
  // Use superjson.stringify rather than JSON.stringify
  // to allow us to store a wider range of variables
  localStorage.setItem(getLocalStorageName(name), stringifyJSON(value))

/**
 * An extended version of Vue's ref() that persists the value to local storage,
 * meaning the value will stay the same across sessions and browser refresh.
 */
export const useLocalRef = <T>(name: string | string[], schema: BaseSchema<T>, defaultValue: T) => {
  return customRef<Output<typeof schema>>((track, trigger) => {
    const target = Array.isArray(name) ? name : [name]
    let value = getLocalStorage(target, schema, defaultValue)
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        setLocalStorage(target, newValue)
        trigger()
      }
    }
  })
}

/**
 * An extended version of Vue's reactive() that persists the value to local storage,
 * meaning the value will stay the same across sessions and browser refresh.
 */
export const useLocalReactive = <T extends object>(
  name: string | string[],
  schema: BaseSchema<T>,
  fallback: T
) => {
  const target = Array.isArray(name) ? name : [name]
  const value = getLocalStorage(target, schema, fallback)

  const ref = reactive<T>(value)

  // Watch our reactive value and persist changes to local storage
  watch(ref, (newValue) => {
    setLocalStorage(target, newValue)
  })

  return ref
}
