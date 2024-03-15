import { MicrocosmAPIFactory } from '@nodenogg.in/core/sync'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { createWebRTCProvider } from './provider'

export type { YMicrocosmAPI } from './YMicrocosmAPI'
export type { createWebRTCProvider } from './provider'

export const createYMicrocosmAPI = (syncServerUrl: string): MicrocosmAPIFactory<YMicrocosmAPI> => {
  const provider = createWebRTCProvider(syncServerUrl)
  return (config) => new YMicrocosmAPI(config, provider)
}
