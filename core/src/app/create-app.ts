import {
  type Microcosm,
  type MicrocosmAPI,
  EditableMicrocosm,
  Microcosms,
  YMicrocosmAPI,
  createWebRTCProvider,
  MicrocosmFactory
} from '../sync'
import { UI, getPersistenceName } from './UI'

export const createYMicrocosm: MicrocosmFactory<EditableMicrocosm<YMicrocosmAPI>> = (opts) =>
  new EditableMicrocosm(
    new YMicrocosmAPI({
      ...opts,
      provider: createWebRTCProvider()
    })
  )

export const createApp: CreateApp = (opts) => ({
  ui: new UI(),
  microcosms: new Microcosms(opts.microcosmFactory),
  getPersistenceName
})

type CreateApp = <API extends MicrocosmAPI, M extends Microcosm<API>>(opts: {
  microcosmFactory: MicrocosmFactory<M>
}) => {
  ui: UI
  microcosms: Microcosms<M>
  getPersistenceName: (...name: string[]) => string[]
}
