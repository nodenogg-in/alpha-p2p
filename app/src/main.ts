import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { telemetry } from './state'

const app = createApp(App)

app.config.errorHandler = telemetry.catch

app.use(createPinia())
app.use(router)

app.mount('#app')
