# gxd

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



## How to start project

* Init project with `vue-cli`：

  ```bash
  # install vue-cli
  cnpm install vue-cli -g
  
  # vue-cli template
  vue init webpack project
  
  # run project
  cnpm install && npm run dev
  ```

  

* Install plugins

  ```bash
  cnpm install less less-loader -D
  
  cnpm install axios -S
  
  cnpm install iview -S
  ```



* config router

  ```javascript
  // src/router/index.js
  
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
  ```

* include components

  ```vue
  <template>
  	<div>
          <sidebar-menu></sidebar-menu>
      </div>
  </template>
  
  <script>
  	import sidebarMenu from "@/components/sidebarMenu"  // first: import component
      
      export default {
          name: 'dashboard',
          components: {   // second: must register components
              sidebarMenu
          }
      }
  </script>
  ```

  

## API

* [国信达地址服务API接口管理系统](http://111.40.214.180/api/index.do#/web/article/detail/web/PAGE/WELCOME)

