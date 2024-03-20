import { createApp } from 'nodenoggin/app'
import { YMicrocosmAPI, createWebRTCProvider } from 'nodenoggin/sync'

const provider = createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)

export const { ui, microcosms, user } = createApp({
  microcosmFactory: (opts) =>
    new YMicrocosmAPI({
      ...opts,
      provider
    })
})
