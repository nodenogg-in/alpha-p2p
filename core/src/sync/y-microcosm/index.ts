import { Microcosm, MicrocosmFactory } from '../microcosm/Microcosm'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { createWebRTCProvider } from './provider'

export { YMicrocosmAPI } from './YMicrocosmAPI'
export { createWebRTCProvider } from './provider'

export const createYMicrocosm = (
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
