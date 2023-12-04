// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/user/About.vue'),
      },
      {
        path: 'seeking',
        component: () => import('@/views/user/Seeking.vue'),
      },
      {
        path: 'welcome',
        component: () => import('@/views/user/Welcome.vue')
      },
      {
        path: 'detail/:id',
        component: () => import('@/views//user/Detail.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
