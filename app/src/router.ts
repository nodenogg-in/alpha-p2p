import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/routes/HomeRoute.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:view/:microcosm_uri*',
      name: 'microcosm',
      component: () => import('@/routes/MicrocosmRoute.vue')
    }
  ]
})

export default router
