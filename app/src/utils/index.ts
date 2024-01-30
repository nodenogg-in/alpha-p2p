import { isNumber } from '@/microcosm/utils/guards'
import type { Entries } from './libs/ts-utils/entries'

export const objectKeys = <O extends object>(obj: O): (keyof O)[] => Object.keys(obj) as (keyof O)[]

export const objectEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>

export const lastInArray = <T>(arr: T[]): T | null => arr[arr.length - 1] || null

export const pluralize = (items: number | Map<unknown, unknown> | unknown[], name: string) => {
  let count: number

  if (isNumber(items)) {
    count = items
  } else {
    count = Array.isArray(items) ? items.length : items.size
  }

  return count === 1 ? `1 ${name}` : `${count} ${name}s`
}
