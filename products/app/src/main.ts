import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { app as nodenoggin } from './state/app'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.warnHandler = nodenoggin.telemetry.catch
app.config.errorHandler = nodenoggin.telemetry.catch

app.use(createPinia())
app.use(router)

app.mount('#app')
