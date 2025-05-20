import { SYNC_SERVER_ENDPOINT } from '@/constants'
import { createApp, NNClient } from '@nodenogg.in/app'
import { createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const client = new NNClient({
  api: createYMicrocosmAPI({
    sync: SYNC_SERVER_ENDPOINT,
    persistence: true
  })
})

export const app = createApp()
