import { createApp } from '@nodenogg.in/core/app'
import { createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const { ui, api, session, telemetry, namespace } = createApp({
  createMicrocosm: createYMicrocosmAPI(import.meta.env.VITE_SYNC_SERVER),
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
