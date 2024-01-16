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
    // {
    //   path: '/:namespace_id/:microcosm_id',
    //   name: 'microcosm',
    //   component: () => import('../views/MicrocosmView.vue')
    // },
    {
      path: '/:microcosm_uri*',
      name: 'microcosm_demo',
      component: () => import('../views/Demo_MicrocosmView.vue')
    },
    {
      path: '/testing/:microcosm_uri',
      name: 'testing',
      component: () => import('../views/Demo_YJS.vue')
    }
  ]
})

export default router
