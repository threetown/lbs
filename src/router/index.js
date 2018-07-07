import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './router'

Vue.use(Router)


const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : '能力开放平台'
  next()
})

export default router;