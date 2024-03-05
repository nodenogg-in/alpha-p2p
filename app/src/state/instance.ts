import { createApp } from 'nodenoggin/app'
import { createYMicrocosm } from 'nodenoggin/sync'

export const { ui, api, app } = createApp({
  createMicrocosm: createYMicrocosm(import.meta.env.VITE_SYNC_SERVER)
})

export type API = typeof api
