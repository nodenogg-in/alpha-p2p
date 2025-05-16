import { SYNC_SERVER_ENDPOINT } from '@/constants'
import { createApp, NNClient } from '@nodenogg.in/app'
import {
  createHocuspocusProvider,
  createYMicrocosmAPI,
  createIndexedDBPersistence
} from '@nodenogg.in/y-microcosm'

console.log("SYNC", SYNC_SERVER_ENDPOINT)
export const client = new NNClient({
  api: createYMicrocosmAPI({
    providers: [
      createHocuspocusProvider({
        sync: SYNC_SERVER_ENDPOINT
      })
    ],
    persistence: [createIndexedDBPersistence()]
  })
})

export const app = createApp()
