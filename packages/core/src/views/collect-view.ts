import type { ViewConfig } from './api'
import type { MicrocosmAPI } from '../api/MicrocosmAPI'

export const collect = async <M extends MicrocosmAPI>(
  _api: M,
  { id }: ViewConfig
): Promise<any> => {
  return {
    type: 'collect',
    id,
    dispose: async () => {}
  }
}
