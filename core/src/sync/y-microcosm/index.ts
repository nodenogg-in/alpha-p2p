import { MicrocosmAPIFactory } from '../Sync'
import { createWebRTCProvider } from './provider'
import { YMicrocosm } from './YMicrocosm'

const defaultProvider = createWebRTCProvider()

export const createYMicrocosm: MicrocosmAPIFactory<YMicrocosm> = (opts) =>
  new YMicrocosm({
    ...opts,
    provider: defaultProvider
  })

export type { YMicrocosm } from './YMicrocosm'
