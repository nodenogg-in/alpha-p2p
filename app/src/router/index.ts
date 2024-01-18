import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/MicrocosmView.vue')
    }
  ]
})

export default router
