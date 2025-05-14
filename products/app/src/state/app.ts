import { SYNC_SERVER_ENDPOINT } from '@/constants'
import { createApp, MicrocosmClient } from '@nodenogg.in/app'
import {
  createHocuspocusProvider,
  createYMicrocosmAPI,
  createIndexedDBPersistence
} from '@nodenogg.in/microcosm/yjs'

export const client = new MicrocosmClient({
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
