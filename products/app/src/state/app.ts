import { SYNC_SERVER_ENDPOINT } from '@/constants'
import { App, MicrocosmClient } from '@nodenogg.in/core'
import { createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const client = new MicrocosmClient({
  api: createYMicrocosmAPI({
    sync: SYNC_SERVER_ENDPOINT,
    persistence: true
  })
})

export const app = new App()
