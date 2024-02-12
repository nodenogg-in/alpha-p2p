import type { Entries } from './lib/ts-utils/entries'

export const objectKeys = <O extends object>(obj: O): (keyof O)[] => Object.keys(obj) as (keyof O)[]

export const objectEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>

export const lastInArray = <T>(arr: T[]): T | null => arr[arr.length - 1] || null
