import type { MicrocosmAPIFactory } from '@nodenogg.in/core'
import { YMicrocosmAPI, type YMicrocosmAPIOptions } from './YMicrocosmAPI'

export { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider, createHocuspocusProvider } from './provider'
export { createIndexedDBPersistence } from './persistence'

export const createYMicrocosmAPI =
  (options: Omit<YMicrocosmAPIOptions, 'config'>): MicrocosmAPIFactory<YMicrocosmAPI> =>
  async (config) => {
    const api = new YMicrocosmAPI({
      config,
      ...options
    })
    await api.init()
    return api
  }
