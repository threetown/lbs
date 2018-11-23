# gxd-lbs

> gxd-lbs subscription number project with vue.js. Documentation can be found at <https://vuejs-templates.github.io/webpack/>



## 前端技术栈

| 说明     | 备注                                    | 说明     | 备注                                    | 说明        | 备注                                                         |
| -------- | --------------------------------------- | -------- | --------------------------------------- | ----------- | ------------------------------------------------------------ |
| 前端框架 | [vue.js](https://cn.vuejs.org/)         | 组件库   | [iview](https://www.iviewui.com/)       | mock 假数据 | [json-server](https://github.com/typicode/json-server)       |
| 路由管理 | [vue-router](https://router.vuejs.org/) | 图表插件 | [ECharts](http://echarts.baidu.com/)    | 表单验证    | [ async-validator](https://github.com/yiminghe/async-validator) |
| 状态管理 | [vuex](https://vuex.vuejs.org/)         | AJAX请求 | [axios](https://github.com/axios/axios) | less        | [less](http://lesscss.cn/)                                   |



## Project Structure

```
.
├── build/                      # webpack config files
│   └── ...
├── config/
│   ├── index.js                # main project config
│   └── ...
├── src/
│   ├── main.js                 # app entry file
│   ├── App.vue                 # main app component
│   ├── components/             # ui components
│   │   └── ...
│   ├── assets/                 # module assets (processed by webpack)
│   │   └── ...
│   ├── config/                 # config
│   │   └── ...
│   ├── filters/                # filters
│   │   └── ...
│   ├── pages                   # views
│   │   ├── dashboard.vue
│   │   ├── application
│   │   │   ├── apps.vue
│   │   │   └── recyclebin.vue
│   │   ├── personal
│   │   │   ├── info.vue
│   │   │   └── ...
│   │   └── ...
│   ├── router                  # vue-router
│   │   ├── index.js
│   │   └── router.js
│   ├── service                 # api request config
│   │   └── ...
│   ├── store                   # vuex
│   │   └── ...
│   └── util                    # tools feature
│       ├── auth                # 权限
│       │   ├── index.js
│       │   └── lazyLoading.js
│       ├── fetch.js
│       ├── pxtorem.js
│       └── tools.js
├── static/                     # pure static assets (directly copied)
├── .babelrc                    # babel config
├── .postcssrc.js               # postcss config
├── .eslintrc.js                # eslint config
├── .editorconfig               # editor config
├── index.html                  # index.html template
└── package.json                # build scripts and dependencies
```



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

