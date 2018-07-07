<template>
    <div class="page-error">
        <img src="~assets/img/error/404.jpg" alt="400-页面不存在"><br>
        <Button type="primary" size="large" @click="goHome">返回首页</Button>
    </div>
</template>
<style lang="less">
    .fullpage{
        position: relative;
        height: 100%;
        width: 100%;
        background-color: #f2f2f2;
    }
    .page-error{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f2f2f2;
        text-align: center;
    }
    
</style>
<script>
    import * as basicConfig from 'src/config/basicConfig'
    export default {
        data () {
            return {}
        },
        methods: {
            goHome(){
                window.location = basicConfig.url.home;
            }
        },
        created(){
            document.body.setAttribute("class", "fullpage");
            document.documentElement.setAttribute("class", "fullpage");
        }
    }
</script>
