import { createApp } from 'nodenoggin/app'
import { createYMicrocosm } from 'nodenoggin/sync'

const createMicrocosm = createYMicrocosm(import.meta.env.VITE_SYNC_SERVER)

export const { ui, api, session, telemetry } = createApp({
  createMicrocosm,
  log: true
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    telemetry.add({
      name: 'HMR',
      message: 'Reloading page',
      level: 'status'
    })
    window.location.reload()
  })
}

export type API = typeof api
