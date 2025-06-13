import { createApp } from 'vue'

import App from './App.vue'
import router from './router.ts'
import './styles.css'

const app = createApp(App)

// Vuejs router
app.use(router)

// mount app to index.html
app.mount('#app')
