import { Map as YMap } from 'yjs'
import { objectEntries } from '..'

export const createYMap = <T extends object>(n: T) => {
  const map = new YMap<T>()
  objectEntries(n).forEach(([k, v]) => {
    map.set(k, v as any)
  })
  return map
}
