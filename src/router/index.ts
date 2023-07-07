import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import FingerGameRoom from '../views/FingerGameRoom.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/finger',
    name: 'home',
    component: FingerGameRoom,
    children: [
      {
        path: ':player',
        name: 'player',
        component: () => import('../components/FingerGame.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
