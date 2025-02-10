import { animation, loop } from '@figureland/kit/motion'
import { createApp, type InferAppMicrocosmAPI } from '@nodenogg.in/app'
import {
  createWebRTCProvider,
  createYMicrocosmAPI,
  createIndexedDBPersistence
} from '@nodenogg.in/microcosm/yjs'

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

export type AppMicrocosmAPI = InferAppMicrocosmAPI<typeof app>
