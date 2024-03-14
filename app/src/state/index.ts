import { createApp } from '@nodenogg.in/core/app'
import { createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

const createMicrocosm = createYMicrocosmAPI(import.meta.env.VITE_SYNC_SERVER)

export const { ui, api, session, telemetry } = createApp({
  createMicrocosm,
  telemetry: {
    log: true
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    telemetry.log({
      name: 'HMR',
      message: 'Reloading page',
      level: 'status'
    })
    window.location.reload()
  })
}

export type API = typeof api

export * from './use-app'
export * from './use-microcosm'
export * from './use-app-router'
export * from './use-view'
