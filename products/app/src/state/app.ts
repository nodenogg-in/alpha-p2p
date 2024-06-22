import { animation, loop } from '@figureland/statekit/animated'
import { createApp } from '@nodenogg.in/framework'
import {
  createWebRTCProvider,
  createYMicrocosmAPI,
  createIndexedDBPersistence
} from '@nodenogg.in/y-microcosm'
import type { InferAppMicrocosmAPI } from 'node_modules/@nodenogg.in/framework/src/create-app'
import { gitState } from 'virtual:git'

export const app = createApp({
  api: createYMicrocosmAPI({
    providers: [createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)],
    persistence: [createIndexedDBPersistence()]
  }),
  telemetry: {
    log: true
  }
})

if (gitState.status === 'ok') {
  app.telemetry.log({
    level: 'status',
    name: 'git',
    message: `${gitState.branch} ${gitState.commitHashShort} ${gitState.message}`
  })
}

export const { animated } = app.use(loop(animation({ fps: 90 }), { autoStart: true }))

export type AppMicrocosmAPI = InferAppMicrocosmAPI<typeof app>
