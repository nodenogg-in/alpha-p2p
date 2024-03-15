import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { telemetry } from './state'

const app = createApp(App)

app.config.errorHandler = (error, _, message) => {
  telemetry.catch(
    {
      name: 'Vue App',
      level: 'fail',
      message
    },
    error
  )
}

app.use(createPinia())
app.use(router)

app.mount('#app')
