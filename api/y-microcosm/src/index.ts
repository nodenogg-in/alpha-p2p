import { Microcosm, MicrocosmFactory } from '@nodenogg.in/core/sync'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { createWebRTCProvider } from './provider'

export { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'

export const createYMicrocosmAPI = (
  syncServerUrl: string
): MicrocosmFactory<Microcosm<YMicrocosmAPI>> => {
  const provider = createWebRTCProvider(syncServerUrl)
  return (opts) =>
    new Microcosm(
      new YMicrocosmAPI({
        ...opts,
        provider
      })
    )
}
