import { parse, type BaseSchema, array, string, tuple } from 'valibot'

const prefix = `nodenoggin_`

const getLocalStorageName = (n: string[]) => `${prefix}${n.join('_')}`

export const get = <T>(name: string[], schema: BaseSchema<T>, fallback: T): T => {
  try {
    if (!localStorage.getItem(getLocalStorageName(name))) {
      throw new Error()
    }
    const result = JSON.parse(localStorage.getItem(getLocalStorageName(name)) || '')
    return parse(schema, result)
  } catch (e) {
    return fallback
  }
}

export const set = (name: string[], value: unknown): void =>
  localStorage.setItem(getLocalStorageName(name), JSON.stringify(value))

export const setMap = (name: string[], value: Map<string, unknown>): void => {
  set(name, Array.from(value.entries()))
}

export const getMap = <T>(name: string[], schema: BaseSchema<T>): Map<string, T> => {
  try {
    const result = get(name, array(tuple([string(), schema])), [])
    return new Map(result)
  } catch {
    return new Map()
  }
}
