import Vue from 'vue'
import Router from 'vue-router'

const dashboard = r => require.ensure([], () => r(require('../pages/dashboard/index')), 'dashboard')

const application = r => require.ensure([], () => r(require('../pages/application/layout')), 'application')
const app = r => require.ensure([], () => r(require('../pages/application/')), 'app')
const recyclebin = r => require.ensure([], () => r(require('../pages/application/recyclebin')), 'recyclebin')

const data = r => require.ensure([], () => r(require('../pages/data/layout')), 'data')
const project = r => require.ensure([], () => r(require('../pages/data/')), 'project')
const mydata = r => require.ensure([], () => r(require('../pages/data/mydata')), 'mydata')


const sys = r => require.ensure([], () => r(require('../pages/sys/layout')), 'sys')
const scree = r => require.ensure([], () => r(require('../pages/sys/scree')), 'scree')
const business = r => require.ensure([], () => r(require('../pages/sys/business')), 'business')
const service = r => require.ensure([], () => r(require('../pages/sys/service')), 'service')
const database = r => require.ensure([], () => r(require('../pages/sys/database')), 'database')
const track = r => require.ensure([], () => r(require('../pages/sys/track')), 'track')
const commit = r => require.ensure([], () => r(require('../pages/sys/commit')), 'commit')

const user = r => require.ensure([], () => r(require('../pages/user/layout')), 'user')
const list = r => require.ensure([], () => r(require('../pages/user/list')), 'list')
const log = r => require.ensure([], () => r(require('../pages/user/log')), 'log')


const personal = r => require.ensure([], () => r(require('../pages/personal/layout')), 'personal')
const info = r => require.ensure([], () => r(require('../pages/personal/')), 'info')
const quota = r => require.ensure([], () => r(require('../pages/personal/quota')), 'quota')
const record = r => require.ensure([], () => r(require('../pages/personal/record')), 'record')

const msg = r => require.ensure([], () => r(require('../pages/msg/layout')), 'msg')
const msglist = r => require.ensure([], () => r(require('../pages/msg/')), 'msglist')

const notFound = r => require.ensure([], () => r(require('components/error/404')), 'notFound')

Vue.use(Router)

const routes = [
  {
    path: '/', name: 'dashboard', component: dashboard,
    redirect: '/application/app',
    meta: {
      title: '管理平台'
    },
    children: [
      {
        path: 'application', name: 'application', component: application,
        meta: {
          title: '应用管理'
        },
        children: [{
            path: 'app', name: 'app', component: app,
            meta: {
              title: '我的应用'
            }
          },{
          path: 'recyclebin', name: 'recyclebin', component: recyclebin,
          meta: {
            title: '回收站'
          }
        }]
      },{
        path: 'data', name: 'data', component: data,
        meta: {
          title: '数据可视化'
        },
        children: [{
          path: 'project', name: 'project', component: project,
          meta: {
            title: '可视化项目'
          }
        },{
          path: 'mydata', name: 'mydata', component: mydata,
          meta: {
            title: '我的数据'
          }
        }]
      },{
        path: 'sys', name: 'sys', component: sys,
        meta: {
          title: '系统监控'
        },
        children: [{
          path: 'scree', name: 'scree', component: scree,
          meta: {
            title: '数据总览'
          }
        },{
          path: 'business', name: 'business', component: business,
          meta: {
            title: '业务管理'
          }
        },{
          path: 'service', name: 'service', component: service,
          meta: {
            title: '服务管理'
          }
        },{
          path: 'database', name: 'database', component: database,
          meta: {
            title: '数据库连接池'
          }
        },{
          path: 'track', name: 'track', component: track,
          meta: {
            title: '追踪服务'
          }
        },{
          path: 'commit', name: 'commit', component: commit,
          meta: {
            title: '操作日志'
          }
        }]
      },{
        path: 'user', name: 'user', component: user,
        meta: {
          title: '用户管理'
        },
        children: [{
          path: 'list', name: 'list', component: list,
          meta: {
            title: '用户列表'
          }
        },{
          path: 'log', name: 'log', component: log,
          meta: {
            title: '登陆日志'
          }
        }]
      },{
        path: 'personal', name: 'personal', component: personal,
        meta: {
          title: '个人中心'
        },
        children: [{
          path: 'info', name: 'info', component: info,
          meta: {
            title: '帐号信息'
          }
        },{
          path: 'quota', name: 'quota', component: quota,
          meta: {
            title: '配额管理'
          }
        },{
          path: 'record', name: 'record', component: record,
          meta: {
            title: '配额申请记录'
          }
        }]
      },{
        path: 'msg', name: 'msg', component: msg,
        meta: {
          title: '消息'
        },
        children: [{
          path: 'index', name: 'index', component: msglist,
          meta: {
            title: '消息'
          }
        }]
      }
    ]
  },
  {
    path: "/*",
    name: "error",
    component: notFound,
    meta: {
      title: '404'
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