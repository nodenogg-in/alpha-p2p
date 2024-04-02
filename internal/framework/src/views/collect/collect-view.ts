import type { MicrocosmAPI } from '@nodenogg.in/microcosm'
import type { ViewConfig, ViewFactoryOptions } from '@nodenogg.in/framework'

export const collect = async <M extends MicrocosmAPI>({
  config: { id }
}: ViewFactoryOptions<M>): Promise<any> => {
  return {
    type: 'collect',
    id,
    dispose: async () => {}
  }
}
