import './styles/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebaseConfig'
import { useUserStore } from './stores/userStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

const userStore = useUserStore()

onAuthStateChanged(auth, (user) => {
  userStore.user = user
  router.push('/BoardView')
  console.log('push: ', router.currentRoute.value.fullPath)
})

app.mount('#app')
