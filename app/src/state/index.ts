import { createApp, hmr } from '@nodenogg.in/core'
import { createWebRTCProvider, createYMicrocosm } from '@nodenogg.in/y-microcosm'

export const { ui, api, session, telemetry, namespace } = createApp({
  createMicrocosm: createYMicrocosm({
    provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
  }),
  telemetry: {
    log: true
  }
})

if (import.meta.env.MODE === 'development') {
  hmr()
}

export type API = typeof api

export * from './use-app'
export * from './use-microcosm'
export * from './use-app-router'
export * from './use-view'
