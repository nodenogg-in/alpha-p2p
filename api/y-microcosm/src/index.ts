import { MicrocosmAPIFactory } from '@nodenogg.in/core/sync'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { ProviderFactory } from './provider'

export type { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'

export type Options = {
  provider: ProviderFactory
}

export const createYMicrocosmAPI =
  ({ provider }: Options): MicrocosmAPIFactory<YMicrocosmAPI> =>
  (config) =>
    new YMicrocosmAPI(config, provider)
