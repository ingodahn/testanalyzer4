// Composables
import { createRouter, createWebHistory, createWebHashHistory,RouterView } from 'vue-router'

//import Tr from "@/i18n/translation"

const routes = [
  {
    path: '/',
    name: 'Home',
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
    path: '/:system/grouping',
    name: "Grouping",
    component: () => import('@/views/GroupingView.vue'),
    meta: {
      layout: 'Default',
    },
  },
  {
    path: "/:system",
    name: "System",
    component: () => import('@/views/SystemView.vue'),
    meta: {
      layout: 'Default',
    },
  },
]

const router = createRouter({
  //In i18n tutorial: history: createWebHistory(import.meta.env.VITE_BASE_URL),
  //history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
})

export default router
