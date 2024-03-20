import { createApp } from '@nodenogg.in/core'
import { spatial, collect } from '@nodenogg.in/core/views'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const { ui, session, telemetry, dispose, microcosms, views } = createApp({
  api: createYMicrocosmAPI({
    provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
  }),
  views: {
    spatial,
    collect
  },
  telemetry: {
    log: true
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    dispose().then(() => {
      telemetry.log({
        name: 'HMR',
        message: 'Reloading page',
        level: 'status'
      })
      window.location.reload()
    })
  })
}
