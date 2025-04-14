import { animation, loop } from '@figureland/kit/motion'
import { createApp, MicrocosmAgent } from '@nodenogg.in/app'
import {
  createHocuspocusProvider,
  createYMicrocosmAPI,
  createIndexedDBPersistence
} from '@nodenogg.in/microcosm/yjs'

export const api = new MicrocosmAgent({
  api: createYMicrocosmAPI({
    providers: [createHocuspocusProvider(import.meta.env.VITE_SYNC_SERVER_ENDPOINT)],
    persistence: [createIndexedDBPersistence()]
  })
})

export const app = createApp({
  telemetry: {
    log: true
  }
})

export const { animated } = app.use(loop(animation({ fps: 90 }), { autoStart: true }))

export type AppMicrocosmAPI = typeof app
