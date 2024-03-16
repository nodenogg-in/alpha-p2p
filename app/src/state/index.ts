import { createApp } from '@nodenogg.in/core'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

const createMicrocosmAPI = createYMicrocosmAPI({
  provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
})

export const { ui, api, session, telemetry, namespace } = createApp({
  createMicrocosmAPI,
  telemetry: { log: true }
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
