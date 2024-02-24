import { createApp } from 'nodenoggin/app'
import { EditableMicrocosm, YMicrocosmAPI, createWebRTCProvider } from 'nodenoggin/sync'

const provider = createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)

export const { ui, microcosms } = createApp({
  microcosmFactory: (opts) =>
    new EditableMicrocosm(
      new YMicrocosmAPI({
        ...opts,
        provider
      })
    )
})
