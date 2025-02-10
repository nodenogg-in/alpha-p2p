import type { MicrocosmAPIFactory } from '@nodenogg.in/microcosm'
import { YMicrocosmAPI, type YMicrocosmAPIOptions } from './YMicrocosmAPI'

export { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'
export { createIndexedDBPersistence } from './persistence'

export const createYMicrocosmAPI =
  (options: Omit<YMicrocosmAPIOptions, 'config'>): MicrocosmAPIFactory<YMicrocosmAPI> =>
  async (config, telemetry) => {
    const api = new YMicrocosmAPI(
      {
        config,
        ...options
      },
      telemetry
    )
    await api.init()
    return api
  }
