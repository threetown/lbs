<template>
    <div>
        <Row :gutter="16" class="mb-12">
            <Col span="12">
                <Row type="flex" justify="space-between" class="countPanel">
                    <Col v-if="service.loading" v-for="i in 4" :key="i"></Col>
                    <Col v-if="!service.loading" v-for="items in overviewService" :key="items.type">
                        <div :class="'dataPanel '+ items.type">
                            <i :class="'iconfont '+ items.icon"></i>
                            <div class="data">
                                <div class="num">{{items.value}}</div>
                                <div class="tips">{{items.name}}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ul class="todayData">
                    <div class="loading" v-if="access.loading">数据正在加载中...</div>
                    <li v-if="!access.loading" v-for="items in overviewAccess">
                        <span class="name">{{items.name}}</span>
                        <span class="num">{{items.value}}</span>
                        <span class="info">昨日同比 <i class="iconfont" :class="(items.percent < 0) ? 'icon-fall' : 'icon-rise'"></i>{{Math.abs(items.percent)}}%</span>
                    </li>
                </ul>
            </Col>
            <Col span="12">
                <div class="normal-block-mod">
                    <div class="mormal-block-hd ivu-row">
                        <h2 class="mbm-title">用户动态</h2>
                    </div>
                    <div class="mormal-block-bd">
                        <ul class="dynamic-list">
                            <div style="text-align: center;line-height: 126px;" v-if="callLog.loading">{{callLog.loadTips}}</div>
                            <li v-if="!callLog.loading" v-for="items in overviewUserLog"><b class="t-blank">{{items.username}}</b> {{items.server}}<span class="date">{{items.time}}</span></li>
                        </ul>
                    </div>
                </div>
            </Col>
        </Row>

        <div class="full-echart-panel mb-12">
            <div class="header">
                <h2 class="title">业务分析 <strong>每日业务总量分析</strong></h2>
            </div>
            <Row class="safeSetting">
                <Col span="12">&nbsp;</Col>
                <Col span="12">
                    <Select v-model="echarts.business.select" @on-change="selectBusinessAnalysis" size="large" style="width:120px;float: right;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="content">
                <div class="business-analysis" style="height: 100%">
                    <leon-area-line-echart :id="echarts.business.id" :option="echarts.business.option"></leon-area-line-echart>
                </div>
            </div>
        </div>

        <div class="full-echart-panel mb-12">
            <div class="header">
                <h2 class="title">流量分析 <strong>每日流量总量分析</strong></h2>
            </div>
            <Row class="safeSetting">
                <Col span="12">&nbsp;</Col>
                <Col span="12">
                    <Select v-model="echarts.flow.select" @on-change="selectFlowAnalysis" size="large" style="width:120px;float: right;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="content">
                <div class="flow-analysis" style="height: 100%">
                    <leon-area-line-echart :id="echarts.flow.id" :option="echarts.flow.option"></leon-area-line-echart>
                </div>
            </div>
        </div>

        <div class="full-echart-panel mb-12">
            <div class="header">
                <h2 class="title">用户分析 <strong>今日新增用户数：{{todayUserCount}} 人，当前用户总数：{{currentUserCount}} 人</strong></h2>
            </div>
            <Row class="safeSetting">
                <Col span="12">&nbsp;</Col>
                <Col span="12">
                    <Select v-model="echarts.userLog.select" @on-change="selectUserLogAnalysis" size="large" style="width:120px;float: right;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="content">
                <div class="user-analysis" style="height: 100%">
                    <leon-line-echart :id="echarts.userLog.id" :option="echarts.userLog.option"></leon-line-echart>
                </div>
            </div>
        </div>

        <div class="triggerButton" @click="showFullScree">大屏<br>展示</div>
        <full-screen v-if="fullScreen.state" @closeFullScreen="closeFullScree"></full-screen>
    </div>
</template>

<script>
    import { selectTimeDict } from "src/config/basicConfig"
    import { ajaxGetServiceOverview, ajaxGetAccessOverview, ajaxGetServiceLogCount, ajaxGetAccessLogCount, ajaxGetUserLogCount, ajaxGetCallLog, ajaxCurrentUserCount } from 'src/service/sys'
    import * as method from 'src/util/sys/'

    import leonAreaLineEchart from "components/echarts/leon-area-line-chart";
    import leonLineEchart from "components/echarts/leon-line-chart";

    import fullScreen from "./components/fullScreen"

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'sys-scree',
        components: {
            leonAreaLineEchart,
            leonLineEchart,
            fullScreen
        },
        data() {
            return {
                selectTimeDict,
                echarts:{
                    business: {
                        select: 'todayOfHours',
                        id: 'business-analysis-echarts',
                        option: {},
                        style: ''
                    },
                    flow: {
                        select: 'todayOfHours',
                        id: 'flow-analysis-echarts',
                        option: {},
                        style: ''
                    },
                    userLog: {
                        select: 'todayOfHours',
                        id: 'userLog-analysis-echarts',
                        option: {},
                        style: ''
                    }
                },
                callLog: {
                    loading: false,
                    loadTips: '努力加载中，请稍等...'
                },
                fullScreen: {
                    state: false
                },
                service: {
                    loading: false
                },
                access: {
                    loading: false
                },
                currentUserCount: 0,
                todayUserCount: 0
            }
        },
        methods: {
            ...mapActions([ 'recordOverviewAccess', 'recordOverviewService', 'recordUserLog' ]),
            closeFullScree(){
                this.fullScreen.state = false;
                document.getElementById('singlePageBox').style.overflow = 'auto'
            },
            showFullScree(){ // 大屏展示
                this.fullScreen.state = true;
                document.getElementById('singlePageBox').style.overflow = 'hidden'
            },
            getCallLog(){
                const self = this;
                this.callLog.loading = true;
                this.callLog.loadTips = '努力加载中，请稍等...'
                ajaxGetCallLog().then(res => {
                    if(res.state === 0){
                        let result = res.data.data;
                        if(result && result.length){
                            self.recordUserLog(result);
                            self.callLog.loading = false;
                        }else{
                            self.callLog.loadTips = '抱歉，暂无数据！'
                        }
                        
                    }else{
                        this.callLog.loadTips = '糟糕，加载失败！'
                    }
                })
            },
            selectUserLogAnalysis(){
                const self = this;
                let params = this.echarts.userLog.select;
                this.getUserLogCount(params, function(value){
                    self.echarts.userLog.option = method.convertUserLineAreaEchartData(value);
                })
            },
            getUserLogCount(params, callback){
                ajaxGetUserLogCount(params).then(res => {
                    if(res.state === 0){
                        if(callback && typeof callback === "function"){
                            callback(res.data.countList)
                        }
                    }
                })
            },
            selectFlowAnalysis(){
                const self = this;
                let params = this.echarts.flow.select;
                this.getFlowAnalysis(params, function(value){
                    self.echarts.flow.option = method.convertFlowLineAreaEchartData(value);
                })
            },
            getFlowAnalysis(params, callback){
                ajaxGetAccessLogCount(params).then(res => {
                    if(res.state === 0){
                        if(callback && typeof callback === "function"){
                            callback(res.data.countList)
                        }
                    }
                })
            },
            selectBusinessAnalysis(){
                const self = this;
                let params = this.echarts.business.select;
                let name = ['业务总量']
                this.getBusinessAnalysis(params, function(value){
                    self.echarts.business.option = method.convertLineAreaEchartData(value, name);
                })
            },
            getBusinessAnalysis(params, callback){
                ajaxGetServiceLogCount(params).then(res => {
                    if(res.state === 0){
                        if (callback && typeof callback === "function") {
                            callback(res.data.countList);
                        }
                    }
                })
            },
            getServiceOverview(){
                const self = this;
                self.service.loading = true
                ajaxGetServiceOverview().then(res => {
                    if(res.state === 0){
                        self.recordOverviewService(method.convertServiceOverview(res.data.data));
                        self.service.loading = false
                    }
                })
            },
            getAccessOverview(){
                const self = this;
                self.access.loading = true;
                ajaxGetAccessOverview().then(res => {
                    if(res.state === 0){
                        self.recordOverviewAccess(method.convertAccessOverview(res.data.data));
                        self.access.loading = false;
                    }
                })
            },
            getCurrentUserCount(){
                const self = this;
                ajaxCurrentUserCount().then(res => {
                    if(res.state === 0){
                        self.currentUserCount = res.data.count;
                    }
                })
            },
            getTodayUserCount(){
                const self = this;
                let data = 'today';
                ajaxGetUserLogCount(data).then(res => {
                    if(res.state === 0){
                        self.todayUserCount = res.data.countList[0].total_count;
                    }
                })
            },
            init(){
                this.getServiceOverview();
                this.getAccessOverview();
                this.selectBusinessAnalysis();
                this.selectFlowAnalysis();
                this.selectUserLogAnalysis();
                this.getCallLog();
                this.getCurrentUserCount();
                this.getTodayUserCount()
            }
        },
        created: function() {
            this.init()
        },
        mounted(){

        },
        computed: {
            ...mapGetters([ 'overviewAccess', 'overviewService', 'overviewUserLog' ])
        }
    };
</script>

<style lang="less">
.mb-12 {
  margin-bottom: 12px;
}
.triggerButton{
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 2;
    border-radius: 50%;
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.2);
    cursor: pointer;
    height: 56px;
    overflow: hidden;
    text-align: center;
    width: 56px;
    background: #008aff;
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    padding: 9px 0;
}
.fullscreen{
    position: relative;
    height: 100%;
    background: #111213;
    .button-group{
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 10;
        font-size: 12px;
        width: 100px;
        height: 34px;
        .triggerFullscree{
            display: none;
            i{
                font-size: 20px;
                margin-right: 5px;
                vertical-align: top;
            }
        }
        
        &:hover{
            .triggerFullscree{
                display: block;
            }
        }
    }
}

.countPanel {
    height: 92px;
  margin-bottom: 12px;
  .ivu-col {
    background: #fff;
    width: 23%;
  }
}
.dataPanel {
  position: relative;
  height: 92px;
  padding: 22px 5px 22px 62px;
  i {
    position: absolute;
    left: 10px;
    top: 25px;
    font-size: 24px;
    line-height: 42px;
    width: 42px;
    height: 42px;
    text-align: center;
    border-radius: 50%;
    background-color: #d6f2ff;
    color: #00a0eb;
  }
  .data {
    .num {
      font-size: 20px;
      line-height: 24px;
      font-family: "MicrosoftYaHei";
      font-weight: bold;
      color: #333;
    }
    .tips {
        color: #999;
        font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &.warning {
    i {
      color: #ff6c00;
      background-color: #ffe5cc;
    }
  }
  &.error-server,
  &.error-user {
    i {
      color: #f71a1a;
      background-color: #ffdfdf;
    }
  }
}
.todayData {
  position: relative;
  background-color: #fff;
  overflow: hidden;
  height: 120px;
  padding: 22px;
  text-align: center;
  .loading{
      position: absolute;
      top: 47%;
      width: 100%;
      color: #999;
  }
  li {
    position: relative;
    width: 33.33%;
    float: left;
    height: 76px;
    &::before {
      position: absolute;
      content: "";
      right: 0;
      top: 50%;
      margin-top: -27px;
      width: 1px;
      height: 54px;
      background-color: #e5e5e5;
    }
    &:last-child::before {
      display: none;
    }
    .name{
        color: #666;
    }
    .num {
      font-size: 26px;
      color: #008aff;
      display: block;
      line-height: 34px;
    }
    .info {
        font-size: 14px;
        color: #999;
        i{
            font-size: 18px;
            vertical-align: top;
            &.icon-fall{
                color: #00A317;
            }
            &.icon-rise{
                color: #F71A1A;
            }
        }
    }
  }
}

.full-echart-panel {
  padding: 20px;
  background-color: #fff;
  .header {
    font-family: MicrosoftYaHei;
    margin-bottom: 12px;
    .title {
      font-size: 16px;
      color: #333;
      line-height: 24px;
      strong {
        font-weight: normal;
        font-size: 14px;
        color: #999;
        display: block;
      }
    }
  }
  .content {
    text-align: center;
    font-size: 16px;
    color: #666;
    height: 300px;
    line-height: 300px;
  }
}

.dynamic-list{
    height: 126px;
    li{
        position: relative;
        height: 25px;
        line-height: 25px;
        padding-right: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .date{
            position: absolute;
            right: 0;
        }
    }
}
</style>