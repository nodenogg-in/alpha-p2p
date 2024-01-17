import { Map as YMap } from 'yjs'
import { objectEntries } from '..'

export const createYMap = <T extends object>(n: T) => {
  const map = new YMap<T>()
  objectEntries(n).forEach(([k, v]) => {
    map.set(k, v as any)
  })
  return map
}

export const updateYMap = <T extends object>(map: YMap<T>, update: Partial<T>) => {
  objectEntries(update).forEach(([k, v]) => {
    map.set(k as string, v as any)
  })
}
