import { App } from 'nodenoggin/app'
import {
  YMicrocosm,
  Microcosms,
  createWebRTCProvider,
  type MicrocosmAPIFactory
} from 'nodenoggin/sync'

export const appState = new App()

const factory: MicrocosmAPIFactory<YMicrocosm> = (opts) =>
  new YMicrocosm({
    ...opts,
    provider: createWebRTCProvider()
  })

export const microcosms = new Microcosms(factory)
