import { createApp } from '@nodenogg.in/framework'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

const setup = () =>
  createApp({
    api: createYMicrocosmAPI({
      provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
    }),
    telemetry: {
      log: true
    }
  })

export const app = setup()
if (import.meta.hot) {
  import.meta.hot.accept(async () => {
    // app.telemetry.log({
    //   name: 'HMR',
    //   message: 'Reloading page',
    //   level: 'status'
    console.log('hot reload!!!')
    await app.dispose()
    window.location.reload()
  })
  // })
}
