import fetch from 'src/util/fetch'
import lazyLoading from './lazyLoading.js'
import * as types from 'src/store/mutation-types'
import * as basicConfig from 'src/config/basicConfig'

let auth = {}

auth.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        title: '404-页面不存在',
        component: 'error/404'
    }];
    // 模拟异步请求
    vm.$Loading.start();
    let gloabLoading = vm.$Message.loading({
        content: '努力加载中，请稍等...',
        duration: 0
    })
    // fetch({ url: '/static/mock/data/menu.json', method: 'get' }).then(res => {
    fetch({ url: '/center/user/getAmpAuthByCondition', method: 'post' }).then(res => {
        if(res.state === 0){
            let data = res.data;
            //
            let newData = auth.generateNewMenuData(data.allAmpAuth);
            auth.initRouterNode(constRoutes, newData);

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
            let userData = data;
            delete userData.allAmpAuth
            vm.$store.commit(types.RECORD_USERINFO, userData)
            
            vm.$Loading.finish()
        }else{
            vm.$Loading.error();
            vm.$Message.error(res.message)
        }
        setTimeout(gloabLoading, 10)
    }).catch(err =>{
        console.log(err);
        vm.$Loading.error()
        setTimeout(gloabLoading, 10)
        setTimeout(function(){
            // window.location = basicConfig.url.jump
        },100)
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
        meta.icon = menu.modelStyle ? menu.modelStyle : null;
        //是否展示

        menu.isHide = menu.isHide ? menu.isHide : null;
        menu.meta = meta;

        routers.push(menu);
    }
};
auth.generateNewMenuData = function(data){ 
    //不展示在菜单项的内部子路由 手动配置 需设置parentName 与菜单项name一致
    let routes = [
        {
            "path": "serviceCallDetail",
            "name": "serviceCallDetail", 
            "component": "sys/serviceCallDetail",
            "title": "服务详情", 
            "isHide":true,
            "parentName":'sys',
        },
        {
            "path": "userDetails",
            "name": "userDetails", 
            "component": "user/components/userDetails",
            "title": "用户详情", 
            "isHide":true,
            "parentName":'sys',
        }
    ]
    routes.map(route =>{
        let index = data.find((v,index) => {return route['parentName'] == v['name']});
        index.children.push(route);
    })
    // let route =  { "path": "serviceCallDetail", "name": "serviceCallDetail", "component": "sys/serviceCallDetail", "title": "服务详情", "isHide":true};
    // data[2].children.push(route);
    return data;
}

export default auth;