/**
 * Lend a Hand Main Application Entry Point
 *
 * Initializes the Vue 3 application instance, Element Plus UI library,
 * Flaticon icons, Vue Router, and registers the global $studentConnect API client.
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@flaticon/flaticon-uicons/css/all/all.css'
import './style.css'

import App from './App.vue'
import router from './router'
import studentConnect from '@/api'

const app = createApp(App)

// Register global properties
app.config.globalProperties.$studentConnect = studentConnect

app.use(router)
app.use(ElementPlus)

/**
 * Waits for Firebase-aware router navigation to resolve before mounting Vue.
 *
 * @returns {Promise<void>} Resolves after the initial route is ready.
 */
async function bootstrap() {
  await router.isReady()
  app.mount('#app')
}

bootstrap()
