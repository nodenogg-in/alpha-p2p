import { MicrocosmFactory } from '../microcosm/Microcosms'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { createWebRTCProvider } from './provider'

export const createYMicrocosm: MicrocosmFactory<YMicrocosmAPI> = (opts) =>
  new YMicrocosmAPI({
    ...opts,
    provider: createWebRTCProvider()
  })
