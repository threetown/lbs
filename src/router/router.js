import dashboard from 'src/pages/dashboard.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('src/pages/error/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('src/pages/error/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'dashboard',
    component: dashboard,
    redirect: '/application/apps',
    meta: { title: '管理平台' },
    children: []
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [];

// 所有上面定义的路由都要写在下面的routes里
export const routes = [
    otherRouter,
    ...appRouter,
    page500,
    page403
];
