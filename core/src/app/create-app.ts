import {
  type Microcosm,
  type MicrocosmAPI,
  type MicrocosmConfig,
  EditableMicrocosm,
  Microcosms,
  YMicrocosmAPI,
  createWebRTCProvider
} from '../sync'
import { UI, getPersistenceName } from './UI'

export const createYMicrocosm = (opts: MicrocosmConfig) =>
  new EditableMicrocosm(
    new YMicrocosmAPI({
      ...opts,
      provider: createWebRTCProvider()
    })
  )

export const createApp = <API extends MicrocosmAPI, M extends Microcosm<API>>(
  factory: (opts: MicrocosmConfig) => M
) => ({
  ui: new UI(),
  microcosms: new Microcosms<M>(factory),
  getPersistenceName
})
