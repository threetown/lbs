import fetch from 'src/util/fetch'
import lazyLoading from './lazyLoading.js'
import * as types from 'src/store/mutation-types'

let auth = {}

auth.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error/404'
    }];
    // 模拟异步请求
    fetch({ url: '/static/mock/data/menu.json', method: 'get' }).then(res => {
        let data = res.data;
        auth.initRouterNode(constRoutes, data.allAmpAuth);
        auth.initRouterNode(otherRoutes, otherRouter);
        // 添加主界面路由
        vm.$store.commit(types.AUTH_APP_ROUTER, constRoutes.filter(item => item.children.length > 0));
        // 添加全局路由
        vm.$store.commit(types.AUTH_DEFAULT_ROUTER, otherRoutes);
        // 刷新界面菜单
        vm.$store.commit(types.AUTH_MENU_LIST, constRoutes.filter(item => item.children.length > 0));

        // 顶部-消息数和昵称
        vm.$store.commit(types.AUTH_USER_NICKNAME, data.staffName)
        vm.$store.commit(types.AUTH_USER_MESSAGE, data.unReadNotice)

    });
};

// 生成路由节点
auth.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        menu.component = lazyLoading(menu.component);

        if (item.children && item.children.length > 0) {
            menu.children = [];
            auth.initRouterNode(menu.children, item.children);
        }
        let meta = {};
        meta.permission = menu.permission ? menu.permission : null;
        meta.title = menu.title ? menu.title : null;
        meta.icon = menu.icon ? menu.icon : null;

        menu.meta = meta;

        routers.push(menu);
    }
};

export default auth;