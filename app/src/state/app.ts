import { createApp } from '@nodenogg.in/app'
import { collect, spatial } from '@nodenogg.in/app/views'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const { ready, ui, session, telemetry, dispose, microcosms, views } = createApp({
  api: createYMicrocosmAPI({
    provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
  }),
  views: {
    spatial,
    collect
  },
  defaultView: 'spatial',
  telemetry: {
    log: true
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(async () => {
    telemetry.log({
      name: 'HMR',
      message: 'Reloading page',
      level: 'status'
    })
    dispose().then(() => {
      window.location.reload()
    })
  })
}
