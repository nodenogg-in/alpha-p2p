import { isArray, isObject, isString } from '@nodenogg.in/toolkit'
import { parse, stringify } from 'superjson'
import type { Unsubscribe } from './subscriptions'
import { PersistenceName } from '../persist'

export type LocalStorageValidator = (v: unknown) => boolean

/**
 * An internal helper to create a standardised, cleaner way for creating
 * keys in localStorage
 */
const getLocalStorageName = (n: string | PersistenceName) => (isArray(n) ? n.join('/') : n)

const store = (v: any) => stringify(v)

const retrieve = (v: string) => parse(v)

/**
 * An internal helper to get a typed, valid value from localStorage
 */
export const getLocalStorage = <T>(
  name: string | PersistenceName,
  validate: LocalStorageValidator,
  fallback: () => T
): T => {
  const target = getLocalStorageName(name)
  try {
    // If nothing exists in localStorage under that name
    if (!localStorage.getItem(target)) {
      // Set the fallback in localStorage anyway
      const content = fallback()
      setLocalStorage(target, content)
      return content
    }
    // Use superjson rather than JSON.parse to support a wider range of types
    const result = retrieve(localStorage.getItem(target) || '')
    // Validate that the stored data in localStorage corresponds to an expected schema
    if (!validate(result)) {
      throw new Error('Failed to parse data')
    }
    return result as T
  } catch (e) {
    // Return the fallback in case of any errors
    setLocalStorage(target, fallback())
    return fallback()
  }
}

/**
 * An internal helper to store a variable in localStorage
 */
export const setLocalStorage = (name: string | PersistenceName, value: unknown): void => {
  // Use superjson.stringify rather than JSON.stringify
  // to allow us to store a wider range of variables
  console.log(typeof value, { value })
  localStorage.setItem(getLocalStorageName(name), store(value))
}

export interface LocalStorageOptions<T> {
  name: PersistenceName
  validate: LocalStorageValidator
  defaultValue: () => T
  interval?: number
}

export const listenToLocalStorage = <T>(
  name: string | PersistenceName,
  validate: LocalStorageValidator,
  fn: (v: T) => void
): Unsubscribe => {
  const onStorageChange = ({ key, newValue }) => {
    if (key === getLocalStorageName(name) && isString(newValue)) {
      const result = retrieve(newValue)

      if (!validate(result)) {
        throw new Error('Failed to parse data')
      }
      return fn(result as T)
    }
  }
  window.addEventListener('storage', onStorageChange)
  return () => {
    window.removeEventListener('storage', onStorageChange)
  }
}
