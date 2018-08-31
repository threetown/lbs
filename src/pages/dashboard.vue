<template>
  <div class="dashboard">
    <Layout style="height: 100%;">
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <div class="layoutLogo" @click="goHome" title="回到首页"></div>
          <div class="sidebar-menu-con" :style="{ width: '200px', overflow: 'auto'}">
            <sidebar-menu
              :open-names="openedMenuArr"
              :menu-list="MenuList"
              :active-name="activeName"
              @on-change="handleChange"
            ></sidebar-menu>
          </div>
        </Sider>
        
        <Layout>
            <div class="layoutHeader">
              <div class="sider-trigger" @click.native="collapsedSider" style="display: none;"><Icon type="android-menu"/></div>
              <div class="xtJbHcb">
                <div class="headerApps">
                  <span class="msg" @click="jumpUrl('index')">消息（{{user.message}}）</span>
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
            <Content>
              <Layout>
                <div class="singlePageBox" id="singlePageBox">
                  <div class="m-25 mt-65" style="margin-bottom: 0;">
                    <router-view></router-view>
                  </div>
                </div>
              </Layout>
            </Content>
        </Layout>
    </Layout>
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
        activeName: this.$route.name,
        isCollapsed: false
      }
    },
    computed: {
      rotateIcon () {
          return [
              'menu-icon',
              this.isCollapsed ? 'rotate-icon' : ''
          ];
      },
      menuitemClasses () {
          return [
              'menu-item',
              this.isCollapsed ? 'collapsed-menu' : ''
          ]
      },
      MenuList(){
        return this.$store.state.auth.MenuList;
      },
      openedMenuArr: {
        get: function () {
          let relative_path_arr = this.$route.path.split('/');
          return relative_path_arr.length > 1 ? relative_path_arr[1].split() : ['application'];
        },
        set: function () {
        }
      }
    },
    methods: {
      collapsedSider () {
          // this.$refs.side1.toggleCollapse();
      },
      handleClickUserDropdown(name){
        const self = this;
        if (name === "logout") {
          this.$Modal.confirm({
              title: '操作提示',
              content: '<p style="font-size: 14px;">确定要退出吗？</p>',
              loading: true,
              className: 'custom-modal vertical-center-modal',
              onOk: () => {
                window.location = basicConfig.url.logout;
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
      },
      jumpUrl(url){
        this.$Notice.open({
            desc: '正在开发中,请稍后再试！'
        });
        // this.$router.push({
        //   name: url
        // })
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
.layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
@import "~assets/styles/dashboard.less";
</style>