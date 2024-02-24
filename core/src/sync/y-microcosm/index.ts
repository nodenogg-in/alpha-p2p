import { EditableMicrocosm } from '../microcosm/EditableMicrocosm'
import { MicrocosmFactory } from '../microcosm/Microcosms'
import { YMicrocosmAPI } from './YMicrocosmAPI'
import { createWebRTCProvider } from './provider'

export const createYMicrocosm: MicrocosmFactory<EditableMicrocosm<YMicrocosmAPI>> = (opts) =>
  new EditableMicrocosm(
    new YMicrocosmAPI({
      ...opts,
      provider: createWebRTCProvider()
    })
  )
