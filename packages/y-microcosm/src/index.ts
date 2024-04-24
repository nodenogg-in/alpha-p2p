import type { MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import type { ProviderFactory } from './provider'
import { YMicrocosmAPI } from './YMicrocosmAPI'

export type { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'

export const createYMicrocosmAPI =
  ({ providers }: { providers: ProviderFactory[] }): MicrocosmAPIFactory<YMicrocosmAPI> =>
  async (config, telemetry) =>
    new YMicrocosmAPI(config, providers, telemetry)
