import { customRef, reactive, watch } from 'vue'
import { parse as parseJSON, stringify as stringifyJSON } from 'superjson'
import { parse, type BaseSchema, set, string, type Output, map } from 'valibot'

import { version as VERSION, name as NAME } from '../../package.json'

const getLocalStorageName = (n: string[]) => [NAME, VERSION, ...n].join('/')

const getLocalStorage = <T>(name: string[], schema: BaseSchema<T>, fallback: T): T => {
  try {
    if (!localStorage.getItem(getLocalStorageName(name))) {
      setLocalStorage(name, fallback)
      throw new Error()
    }
    const result = parseJSON(localStorage.getItem(getLocalStorageName(name)) || '')
    return parse(schema, result)
  } catch (e) {
    return fallback
  }
}

const setLocalStorage = (name: string[], value: unknown): void =>
  localStorage.setItem(getLocalStorageName(name), stringifyJSON(value))

export const useLocalPrimitive = <T>(
  name: string | string[],
  schema: BaseSchema<T>,
  defaultValue: T
) => {
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

export const useLocalMap = <T>(
  name: string | string[],
  schema: BaseSchema<T>,
  fallback: Map<string, T> = new Map()
) => {
  const target = Array.isArray(name) ? name : [name]
  const value = getLocalStorage(target, map(string(), schema), fallback)

  const ref = reactive<Map<string, T>>(value)

  watch(ref, (newValue) => {
    setLocalStorage(target, newValue)
  })

  return ref
}

export const useLocalSet = <T>(
  name: string | string[],
  schema: BaseSchema<T>,
  fallback: Set<T> = new Set()
) => {
  const target = Array.isArray(name) ? name : [name]
  const value = getLocalStorage(target, set(schema), fallback)

  const ref = reactive<Set<T>>(value)

  watch(ref, (newValue) => {
    setLocalStorage(target, newValue)
  })

  return ref
}
