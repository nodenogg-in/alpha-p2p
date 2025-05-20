import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/routes/index.route.vue'
import AboutView from '@/routes/about.route.vue'
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
      path: '/:microcosmUUID',
      name: 'microcosm',
      component: () => import('@/routes/microcosm.route.vue')
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/routes/not-found.route.vue'),
      props: true
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
})

export default router
