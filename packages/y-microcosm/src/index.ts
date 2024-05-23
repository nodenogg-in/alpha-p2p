import type { MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import type { ProviderFactory } from './provider'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import type { PersistenceFactory } from './persistence'

export type { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'
export { createIndexedDBPersistence } from './persistence'

export const createYMicrocosmAPI =
  ({
    providers,
    persistence
  }: {
    providers: ProviderFactory[]
    persistence: PersistenceFactory[]
  }): MicrocosmAPIFactory<YMicrocosmAPI> =>
  async (config, telemetry) => {
    const api = new YMicrocosmAPI(config, providers, persistence, telemetry)
    await api.init()
    return api
  }
