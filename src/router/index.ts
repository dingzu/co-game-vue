import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import FingerGameRoom from '../views/FingerGameRoom.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/finger/room'
  },
  {
    path: '/finger/room',
    name: 'room',
    component: FingerGameRoom,
  },
  {
    path: '/finger/table/:tableIndex',
    name: 'table',
    component: () => import('../components/FingerGame.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
