// Composables
import { createRouter, createWebHistory, RouterView } from 'vue-router'

//import Tr from "@/i18n/translation"

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: ':system',
        name: "System",
        component: () => import('@/views/SystemView.vue')
      }
    ],
  },
  /*
  {
    path: "/:system",
    name: "system",
    component: () => import('@/views/SystemView.vue')
  },
  */
]

/*
const routes = [
  {
    path: '/:locale?',
    //component: RouterView,
    component: () => import('@/layouts/default/Default.vue'),
    beforeEnter: Tr.routeMiddleware,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: 'system',
        name: 'system',
        component: () => import('@/views/SystemView.vue')
      }
    ]
  }
]
*/

const router = createRouter({
  //In i18n tutorial: history: createWebHistory(import.meta.env.VITE_BASE_URL),
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
