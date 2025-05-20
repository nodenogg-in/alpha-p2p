import type { MicrocosmAPIConfig, MicrocosmAPIFactory } from '@nodenogg.in/core'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { createHocuspocusProvider, ProviderFactory } from './provider'
import { createIndexedDBPersistence, PersistenceFactory } from './persistence'

export { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider, createHocuspocusProvider } from './provider'
export { createIndexedDBPersistence } from './persistence'

export type YMicrocosmAPIOptions = {
  readonly config: MicrocosmAPIConfig
  readonly providers?: ProviderFactory[]
  readonly persistence?: PersistenceFactory[]
}

export const createYMicrocosmAPI =
  ({
    sync,
    persistence
  }: {
    sync: string
    persistence?: boolean
  }): MicrocosmAPIFactory<YMicrocosmAPI> =>
  async (config) => {
    const api = new YMicrocosmAPI({
      config,
      providers: [
        createHocuspocusProvider({
          sync
        })
      ],
      persistence: persistence ? [createIndexedDBPersistence()] : []
    })
    await api.init()
    return api
  }
