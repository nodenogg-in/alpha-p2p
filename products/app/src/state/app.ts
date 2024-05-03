import { animation, loop } from '@figureland/statekit/animated'
import { createApp } from '@nodenogg.in/framework'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'
import { createIndexedDBPersistence } from '@nodenogg.in/y-microcosm'

export const app = createApp({
  api: createYMicrocosmAPI({
    providers: [createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)],
    persistence: [createIndexedDBPersistence()]
  }),
  telemetry: {
    log: true
  }
})

export const { animated } = app.use(loop(animation({ fps: 90 }), { autoStart: true }))

if (import.meta.hot) {
  import.meta.hot.accept(async () => {
    app.dispose()
    window.location.reload()
  })
}
