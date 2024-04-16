import { createApp } from '@nodenogg.in/framework'
import { collect, spatial } from '@nodenogg.in/framework/views'
import { createWebRTCProvider, createYMicrocosmAPI } from '@nodenogg.in/y-microcosm'

export const {
  ready,
  session,
  telemetry,
  dispose,
  microcosms,
  views,
  filedrop,
  pointer,
  keycommands,
  identity,
  device,
  screen,
  ui
} = createApp({
  api: createYMicrocosmAPI({
    provider: createWebRTCProvider(import.meta.env.VITE_SYNC_SERVER)
  }),
  views: {
    spatial,
    collect
  },
  defaultView: 'spatial',
  telemetry: {
    log: true
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(async () => {
    telemetry.log({
      name: 'HMR',
      message: 'Reloading page',
      level: 'status'
    })
    dispose().then(() => {
      window.location.reload()
    })
  })
}
