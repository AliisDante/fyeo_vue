import './assets/main.css'

import { createApp } from 'vue'
import { createLogger } from 'vue-logger-plugin'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(createLogger())
app.mount('#app')
