import { disposable } from '@figureland/statekit'
import type { YMapEvent, Map as YMap } from 'yjs'

export const createYMapListener = <T extends any>(m: YMap<T>, fn: (e: YMapEvent<T>) => void) => {
  m.observe(fn)
  return disposable(() => m.unobserve(fn))
}
