import type { MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import type { ProviderFactory } from './provider'
import { YMicrocosmAPI } from './YMicrocosmAPI'

export type { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'

export type Options = {
  provider: ProviderFactory
}

export const createYMicrocosmAPI =
  ({ provider }: Options): MicrocosmAPIFactory<YMicrocosmAPI> =>
  (config) =>
    new YMicrocosmAPI(config, provider)
