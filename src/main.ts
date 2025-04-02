import './styles/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n/index'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebaseConfig'
import { useUserStore } from './stores/userStore'
import { useBoardStore } from './stores/boardStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

const userStore = useUserStore()
const boardStore = useBoardStore()

onAuthStateChanged(auth, (user) => {
  userStore.user = user
  if (user && user.email) {
    void boardStore.loadBoards(user.email!)
  }
  router.push('/BoardView/1')
  console.log('push: ', router.currentRoute.value.fullPath)
})

app.mount('#app')
