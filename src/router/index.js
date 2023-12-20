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
        path: 'explore',
        component: () => import('@/views/user/Explore.vue'),
      },
      {
        path: 'greet',
        component: () => import('@/views/user/Greet.vue')
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/user/Detail.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/views/Admin.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/admin/Bill.vue')
      },
      {
        path: 'request',
        component: () => import('@/views/admin/Request.vue')
      },
      {
        path: 'response',
        component: () => import('@/views/admin/Response.vue')
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
  },
  {
    path: '/:catchAll(.*)', redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
