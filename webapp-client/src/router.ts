import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './components/LandingPage.vue'
import ResourceDetail from './components/ResourceDetail.vue'
import ResourceList from './components/ResourceList.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/resourceA',
    name: 'ResourceList',
    component: ResourceList
  },
  {
    path: '/resourceA/:id',
    name: 'ResourceDetail',
    component: ResourceDetail
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
