import { customRef, reactive, watch } from 'vue'
import { parse as parseJSON, stringify as stringifyJSON } from 'superjson'
import { parse, type BaseSchema, type Output } from 'valibot'
import { APP_NAME, SCHEMA_VERSION } from '@/microcosm/types/constants'

/**
 * An internal helper to create a standardised, cleaner way for creating
 * keys in localStorage
 */
const getLocalStorageName = (n: string[]) => [APP_NAME, SCHEMA_VERSION, ...n].join('/')

/**
 * An internal helper to get a typed, valid value from localStorage
 */
export const getLocalStorage = <T>(
  name: string | string[],
  schema: BaseSchema<T>,
  fallback: T
): T => {
  try {
    const target = getLocalStorageName(Array.isArray(name) ? name : [name])
    // If nothing exists in localStorage under that name
    if (!localStorage.getItem(target)) {
      // Set the fallback in localStorage anyway
      setLocalStorage(name, fallback)
      throw new Error()
    }
    // Use superjson rather than JSON.parse to support a wider range of variables
    const result = parseJSON(localStorage.getItem(target) || '')

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
export const setLocalStorage = (name: string | string[], value: unknown): void =>
  // Use superjson.stringify rather than JSON.stringify
  // to allow us to store a wider range of variables
  localStorage.setItem(
    getLocalStorageName(Array.isArray(name) ? name : [name]),
    stringifyJSON(value)
  )

/**
 * An extended version of Vue's ref() that persists the value to local storage,
 * meaning the value will stay the same across sessions and browser refresh.
 */
export const localRef = <T>(name: string | string[], schema: BaseSchema<T>, defaultValue: T) => {
  return customRef<Output<typeof schema>>((track, trigger) => {
    let value = getLocalStorage(name, schema, defaultValue)
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        setLocalStorage(name, newValue)
        trigger()
      }
    }
  })
}

/**
 * An extended version of Vue's reactive() that persists the value to local storage,
 * meaning the value will stay the same across sessions and browser refresh.
 */
export const localReactive = <T extends object>(
  name: string | string[],
  schema: BaseSchema<T>,
  fallback: T
) => {
  const value = getLocalStorage(name, schema, fallback)

  const ref = reactive<T>(value)

  // Watch our reactive value and persist changes to local storage
  watch(ref, (newValue) => {
    setLocalStorage(name, newValue)
  })

  return ref
}
