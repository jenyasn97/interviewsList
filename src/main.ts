import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import Aura from '@primeuix/themes/aura'

import { initializeApp } from 'firebase/app'
import firebaseConfig from '@/config/firebaseConfig.ts'
import App from '@/App.vue'
import router from '@/router'
import ToastService from 'primevue/toastservice'

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
})

initializeApp(firebaseConfig)
const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: false || 'none',
    },
  },
})
app.use(createPinia())
app.use(router)
app.use(ToastService)

app.mount('#app')
