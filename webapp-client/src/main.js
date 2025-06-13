import axios from 'axios'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router.js'
import './styles.css'

const app = createApp(App)

// Vuejs router
app.use(router)

// global variables
const axiosInstance = axios.create({
  baseURL: '/api',
})
app.provide('axios', axiosInstance)

// mount app to index.html
app.mount('#app')
