// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/seeking',
    component: () => import('@/views/Seeking.vue'),
  },
  {
    path: '/welcome',
    component: () => import('@/views/Welcome.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
