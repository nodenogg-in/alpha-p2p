import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { telemetry } from './state'

const app = createApp(App)

// app.config.errorHandler = (...err) => {
//   telemetry.log({
//     name: 'Vue App',
//     message: err[2],
//     level: 'fail',
//     error: err[0]
//   })
// }

app.use(createPinia())
app.use(router)

app.mount('#app')
