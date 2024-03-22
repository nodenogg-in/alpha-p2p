import type { MicrocosmAPI } from '@nodenogg.in/microcosm'
import type { ViewConfig } from '@nodenogg.in/app'

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
