import type { ViewConfig, View } from './api'
import type { MicrocosmAPI } from '../api/MicrocosmAPI'

export const collect = <M extends MicrocosmAPI>({ id }: ViewConfig<M>): View => {
  return { id, dispose: async () => {} }
}
