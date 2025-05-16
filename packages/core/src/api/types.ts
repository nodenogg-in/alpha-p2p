import type { MicrocosmAPI, MicrocosmAPIConfig } from './MicrocosmAPI'

export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (
  args: MicrocosmAPIConfig
) => Promise<M>
