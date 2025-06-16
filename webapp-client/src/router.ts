import { createRouter, createWebHistory } from 'vue-router'
import CriteriaForm from './components/CriteriaForm.vue'

const routes = [
  {
    path: '/',
    name: 'CriteriaForm',
    component: CriteriaForm,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
