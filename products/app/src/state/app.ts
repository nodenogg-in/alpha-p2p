import { SYNC_SERVER_ENDPOINT } from '@/constants'
import { createApp, MicrocosmAPI } from '@nodenogg.in/app'
import {
  createHocuspocusProvider,
  createYMicrocosmAPI,
  createIndexedDBPersistence
} from '@nodenogg.in/microcosm/yjs'

export const api = new MicrocosmAPI({
  api: createYMicrocosmAPI({
    providers: [
      createHocuspocusProvider({
        sync: SYNC_SERVER_ENDPOINT
      })
    ],
    persistence: [createIndexedDBPersistence()]
  })
})

export const app = createApp({
  telemetry: {
    log: true
  }
})
