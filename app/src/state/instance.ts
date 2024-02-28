import { createApp } from 'nodenoggin/app'
import { Microcosm, YMicrocosmAPI, createWebRTCProvider } from 'nodenoggin/sync'

const provider = createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)

export const { ui, api } = createApp({
  create: (opts) =>
    new Microcosm(
      new YMicrocosmAPI({
        ...opts,
        provider
      })
    )
})
