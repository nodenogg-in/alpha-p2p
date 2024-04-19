import { createApp } from '@nodenogg.in/framework'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const app = createApp({
  api: createYMicrocosmAPI({
    provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
  }),
  telemetry: {
    log: true
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(async () => {
    console.log('hot reload!!!')
    await app.dispose()
    window.location.reload()
  })
}
