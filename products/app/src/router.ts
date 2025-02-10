import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/routes/HomeRoute.vue'
import AboutView from '@/routes/AboutRoute.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/microcosm/:microcosmID',
      name: 'microcosm',
      component: () => import('@/routes/MicrocosmRoute.vue')
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/routes/NotFoundRoute.vue'),
      props: true
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
})

export default router
