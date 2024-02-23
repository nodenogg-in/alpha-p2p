import { createApp } from 'nodenoggin/app'
import { EditableMicrocosm, YMicrocosmAPI, createWebRTCProvider } from 'nodenoggin/sync'

export const { ui, microcosms, getPersistenceName } = createApp(
  (opts) =>
    new EditableMicrocosm(
      new YMicrocosmAPI({
        ...opts,
        provider: createWebRTCProvider()
      })
    )
)
