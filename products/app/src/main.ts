import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { app as nnApp } from './state/app'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// app.config.errorHandler = nnApp.telemetry.catch

app.use(createPinia())
app.use(router)

app.mount('#app')
