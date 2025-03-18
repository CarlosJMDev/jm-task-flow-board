import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import BoardView from '@/views/BoardView.vue'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/BoardView',
      name: 'boardview',
      component: BoardView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Si la ruta requiere autenticación y no hay usuario, redirige a 'auth'
  if (requiresAuth && !userStore.user) {
    next({ name: 'auth' })
  } else {
    next()
  }
})

export default router
