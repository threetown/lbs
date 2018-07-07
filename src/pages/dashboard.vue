<template>
  <div class="dashboard">
    <div class="layoutHeader">
      <div class="xtJbHcb">
        <div class="Logo" @click="goHome" title="回到首页"></div>
        <div class="headerApps">
          <router-link to="/msg/index" class="msg">消息（{{user.message}}）</router-link>
          <span class="split"></span>
          <Dropdown class="appUserInfo" trigger="click" @on-click="handleClickUserDropdown">
            <a href="javascript:void(0)" style="height: 40px;display: block;">
              {{user.name}}
              <Icon type="chevron-down"></Icon>
            </a>
            <DropdownMenu class="menu" slot="list">
                <DropdownItem name="setting"><router-link to="/personal/info">个人中心</router-link></DropdownItem>
                <DropdownItem name="logout">退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="sidebar-menu-con" :style="{ width: '200px', overflow: 'auto'}">
      <sidebar-menu
        :open-names="openedMenuArr"
        :menu-list="MenuList"
        :active-name="activeName"
        @on-change="handleChange"
      ></sidebar-menu>
    </div>
    <div class="singlePageBox">
        <div class="m-25 mt-65">
          <router-view></router-view>
        </div>
    </div>
  </div>
</template>

<script>
  import sidebarMenu from "@/components/sidebarMenu";
  import * as basicConfig from 'src/config/basicConfig'
  import { ajaxPostLogout } from 'src/service/personal'

  export default {
    name: 'dashboard',
    components: {
      sidebarMenu
    },
    data() {
      return {
        user: {
          name: this.$store.state.auth.nickname,
          message: this.$store.state.auth.message
        },
        activeName: this.$route.name
      }
    },
    watch: {
      $route(to) {
        
      }
    },
    computed: {
      MenuList(){
        return this.$store.state.auth.MenuList;
      },
      openedMenuArr(){
        let relative_path_arr = this.$route.path.split('/');
        return relative_path_arr.length > 1 ?[relative_path_arr[1]] : ['application'];
      }
    },
    methods: {
      handleClickUserDropdown(name){
        const self = this;
        if (name === "logout") {
          this.$Modal.confirm({
              title: '操作提示',
              content: '<p style="font-size: 14px;">确定要退出吗？</p>',
              loading: true,
              className: 'custom-modal vertical-center-modal',
              onOk: () => {
                window.location = 'http://testlbs.cindata.cn/amp/client/logout';
              }
          });
        }
      },
      goHome(){
         window.location = basicConfig.url.home;
      },
      handleChange(name){
        this.$router.push({
          name: name
        })
      }
    },
    watch:{
        '$route' (to, from){
          this.activeName = to.name;
          this.openedMenuArr = [to.path.split('/')[1]]
        }
    }
  }
</script>

<style lang="less">
  @import "~assets/styles/dashboard.less";
</style>