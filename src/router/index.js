// Composables
import { createRouter, createWebHistory, RouterView } from 'vue-router'

//import Tr from "@/i18n/translation"

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: {
      layout: 'Default',
    },
  },
  {
    path: '/:system/settings',
    name: "Settings",
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      layout: 'Default',
    },
  },
  {
    path: '/:system/analysis',
    name: "Analysis",
    component: () => import('@/views/AnalysisView.vue'),
    meta: {
      layout: 'Default',
    },
  },
  {
    path: '/:system/problem',
    name: "Problem",
    component: () => import('@/views/ProblemView.vue'),
    meta: {
      layout: 'Default',
    },
  },
  {
    path: "/:system",
    name: "system",
    component: () => import('@/views/SystemView.vue'),
    meta: {
      layout: 'Default',
    },
  },
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
