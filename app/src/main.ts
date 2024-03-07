import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createApp as createNodeNogginApp } from 'nodenoggin/app'
import { createYMicrocosm } from 'nodenoggin/sync'

import App from './App.vue'
import router from './router'

const app = createApp(App)

export const { ui, api, session, telemetry } = createNodeNogginApp({
  createMicrocosm: createYMicrocosm(import.meta.env.VITE_SYNC_SERVER),
  log: true
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    telemetry.add({
      name: 'HMR',
      message: 'Reloading page',
      level: 'status'
    })
    window.location.reload()
  })
}

export type API = typeof api

app.config.errorHandler = (...err) => {
  telemetry.add({
    name: 'Vue App',
    message: err[2],
    level: 'fail',
    error: err[0]
  })
}

app.use(createPinia())
app.use(router)

app.mount('#app')
