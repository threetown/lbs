<template>
  <div class="dashboard">
    <div class="layoutHeader">
      <div class="xtJbHcb">
        <div class="Logo"><a href="/"></a></div>
        <div class="headerApps">
          <span>消息（5）</span>
          <span class="split"></span>
          <Dropdown class="appUserInfo" trigger="click" @on-click="handleClickUserDropdown">
            <a href="javascript:void(0)" style="height: 40px;display: block;">
              {{user.name}}
              <Icon type="chevron-down"></Icon>
            </a>
            <DropdownMenu class="menu" slot="list">
                <DropdownItem name="setting">个人中心</DropdownItem>
                <DropdownItem name="logout">退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="sidebar-menu-con" :style="{ width: '200px', overflow: 'auto'}">
      <sidebar-menu></sidebar-menu>
    </div>
    <div class="singlePageBox">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import sidebarMenu from "@/components/sidebarMenu";
  import { ajaxPostLogout } from 'src/service/personal'


  export default {
    name: 'dashboard',
    components: {
      sidebarMenu
    },
    data() {
      return {
        user: {
          name: 'Leon'
        }
      }
    },
    watch: {
      $route(to) {
        
      }
    },
    methods: {
      handleClickUserDropdown(name){
        const self = this;
        if (name === "setting") {
          this.$router.push({ name: 'info' });
        } else if (name === "logout") {
          this.$Modal.confirm({
            title: '操作提示',
            content: '<p style="font-size: 14px;">确定要删除吗？</p>',
            loading: true,
            className: 'custom-modal vertical-center-modal',
            onOk: () => {
              ajaxPostLogout().then(res => {
                console.log(res)
              })
              self.$Message.success('退出成功了呢！')
              // TODO
            }
        });
          
        }
      }
    }
  }
</script>


<style lang="less">
  ::-webkit-scrollbar{width:8px;height:8px;}
  ::-webkit-scrollbar-track,::-webkit-scrollbar-thumb{border-radius:999px;border:10px solid #ebedf0;}
  ::-webkit-scrollbar-track{box-shadow:1px 1px 8px rgba(0,0,0,.2) inset;}
  ::-webkit-scrollbar-thumb{min-height:20px;background-clip:content-box;border:10px solid #498aff;}
  ::-webkit-scrollbar-corner{background:transparent;}
  .m-25 {
    margin: 25px;
  }
  .mb-24 {
    margin-bottom: 24px;
  }
  .normal-block-mod {
    background: #fff;
    .mormal-block-hd {
      height: 48px;
      line-height: 48px;
      padding: 0 20px;
      border-bottom: 1px solid #ebeff4;
      .mbm-title {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        float: left;
      }
      .mbm-opt {
        float: right;
      }
    }
    .mormal-block-bd {
      padding: 25px;
      color: #999;
    }
    .mormal-tabs-bd{
      padding: 15px 25px 25px;
    }
  }
  .dashboard{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ebeff4;
    font-size: 14px;
  }
  .layoutHeader {
    height: 64px;
    background: #008aff;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    position: fixed;
    width: 100%;
    z-index: 11;
    .xtJbHcb {
      width: 100%;
      height: 40px;
      min-width: 1050px;
      font-size: 12px;
      margin-top: -20px;
      position: absolute;
      z-index: 999;
      top: 50%;
      left: 0;
      font-family: microsoft yahei,tahoma,arial;
    }
    .Logo {
      float: left;
      width: 200px;
      height: 40px;
      background: url('~assets/img/logo.png') center no-repeat;
    }
    .headerApps {
      color: #fff;
      height: 100%;
      margin-right: 20px;
      float: right;
      a{
        color: #fff;
      }
      span{
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        margin-left: 10px;
        font-family: 'Microsoft YaHei';
        display: inline-block;
      }
      .split{
        display: inline-block;
        width: 0;
        height: 12px;
        margin-bottom: -1px;
        border-left: 2px solid #fff;
      }
      .appUserInfo{
        height: 40px;
        font-size: 14px;
        margin-left: 12px;
        .menu{
          padding: 12px 0;
          li{
            font-size: 14px!important;
            text-align: left;
            a{
              color: #495060;
            }
          }
          
        }
      }
    }
  }
  .sidebar-menu-con {
    height: 100%;
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 21;
    transition: width 0.3s;
    background: #495060;
  }
  .single-page-con {
    position: absolute;
    top: 64px;
    left: 180px;
    right: 0;
    bottom: 0;
    overflow: auto;
    background-color: #ebeff4;
    z-index: 1;
    transition: left 0.3s;
    min-width: 1020px;
  }
  .singlePageBox{
    position: absolute;
    top: 64px;
    left: 200px;
    right: 0;
    bottom: 0;
    overflow: auto;
    background-color: #ebeff4;
    z-index: 1;
    transition: left 0.3s;
    min-width: 1020px;
  }
</style>