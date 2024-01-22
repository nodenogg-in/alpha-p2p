import { kebabCase } from 'scule'
import { is, number, string } from 'valibot'
import type { Entries } from './libs/ts-utils/entries'

export { nanoid as createUuid } from 'nanoid'

export const validateMicrocosmName = (name: string) => is(string(), name) && name.length > 1

export const sanitiseMicrocosmName = (name: string) => kebabCase(name.trim())

export const createTimestamp = () => Date.now()

export const createURI = (namespace_id: string, microcosm_id: string) =>
  `${namespace_id}/${microcosm_id}`

export const pluralize = (items: number | Map<unknown, unknown> | unknown[], name: string) => {
  let count: number

  if (isNumber(items)) {
    count = items
  } else {
    count = Array.isArray(items) ? items.length : items.size
  }

  return count === 1 ? `1 ${name}` : `${count} ${name}s`
}

export const isString = (n: unknown): n is string => is(string(), n)

export const isNumber = (n: unknown): n is number => is(number(), n)

export const objectKeys = <O extends object>(obj: O): (keyof O)[] => Object.keys(obj) as (keyof O)[]

export const objectEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>
