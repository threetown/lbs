<template>
    <Menu :active-name="active_name" :theme="theme" :open-names="open_names"  @on-select="changeMenu" width="200px">
        <Submenu name="application">
            <template slot="title">
                <Icon type="ios-paper"></Icon>
                应用管理
            </template>
            <MenuItem name="apps">我的应用</MenuItem>
            <MenuItem name="recyclebin" key="recyclebin">回收站</MenuItem>
        </Submenu>
        <Submenu name="data">
            <template slot="title">
                <Icon type="ios-people"></Icon>
                数据可视化
            </template>
            <MenuItem name="project">可视化项目</MenuItem>
            <MenuItem name="mydata">我的数据</MenuItem>
        </Submenu>
        <Submenu name="sys">
            <template slot="title">
                <Icon type="stats-bars"></Icon>
                系统监控
            </template>
            <MenuItem name="scree">数据总览</MenuItem>
            <MenuItem name="business">业务管理</MenuItem>
            <MenuItem name="service">服务管理</MenuItem>
            <MenuItem name="database">数据库连接池</MenuItem>
            <MenuItem name="track">追踪服务</MenuItem>
            <MenuItem name="commit">操作日志</MenuItem>
        </Submenu>
        <Submenu name="user">
            <template slot="title">
                <Icon type="ios-people"></Icon>
                用户管理
            </template>
            <MenuItem name="list">用户列表</MenuItem>
            <MenuItem name="log">登陆日志</MenuItem>
        </Submenu>
        <Submenu name="personal">
            <template slot="title">
                <Icon type="ios-people"></Icon>
                个人中心
            </template>
            <MenuItem name="info">帐号信息</MenuItem>
            <MenuItem name="quota">配额管理</MenuItem>
            <MenuItem name="record">配额申请记录</MenuItem>
        </Submenu>
        <Submenu name="msg">
            <template slot="title">
                <Icon type="ios-people"></Icon>
                消息
            </template>
            <MenuItem name="index">消息</MenuItem>
        </Submenu>
    </Menu>
</template>

<script>
    export default {
    	name: 'sideBar',
        data () {
            return {
                theme: 'dark',
                open_names: []
            }
        },
        methods: {
            changeMenu(active) {
                this.$router.push({
                    name: active
                });
            },
            init(){
                this.active_name = this.$route.name;
                let relative_path_arr = this.$route.path.split('/');
                this.open_names = relative_path_arr.length > 1 ?[relative_path_arr[1]] : ['application'];
            }
        },
        created() {
            this.init()
        },
        watch:{
            '$route' (to, from){
                if(to.name == 'quota'){
                    this.open_names = [to.name];
                }
            }
        }
    }
</script>
