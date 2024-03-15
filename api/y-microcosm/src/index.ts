import { MicrocosmFactory } from '@nodenogg.in/core/sync'
import { YMicrocosm } from './YMicrocosm'
import { ProviderFactory } from './provider'

export type { YMicrocosm } from './YMicrocosm'
export { createWebRTCProvider } from './provider'

export type Options = {
  provider: ProviderFactory
}

export const createYMicrocosm =
  ({ provider }: Options): MicrocosmFactory<YMicrocosm> =>
  (config) =>
    new YMicrocosm(config, provider)
