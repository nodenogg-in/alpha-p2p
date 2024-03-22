import type { ViewConfig, MicrocosmAPI } from '@nodenogg.in/core'

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
