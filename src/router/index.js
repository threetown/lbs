import Vue from 'vue'
import Router from 'vue-router'

const dashboard = r => require.ensure([], () => r(require('../pages/dashboard/index')), 'dashboard')

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: dashboard,
    meta: {
      title: '管理平台'
    }
  }
];

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