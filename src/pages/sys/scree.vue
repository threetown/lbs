<template>
    <div class="dataScreenWrapper">
        <Row  :gutter="16" class="mb-12" style="margin-left:0;margin-right:0">
            <Row type="flex" justify="space-between" class="countPanel">
                <Col v-if="access.loading" v-for="i in 4" :key="i"></Col>
                <Col v-if="!access.loading" v-for="items in overviewAccess">
                    <div class="name">{{items.name}}</div>
                    <div class="num">{{items.value}}</div>
                    <div class="info">
                        <div class="infoItem">周同比
                            <i class="iconfont" :class="(items.weekPercent < 0) ? 'icon-fall' : 'icon-rise'">
                            </i>{{Math.abs(items.weekPercent)}}%
                        </div>
                        <div class="infoItem">日环比
                            <i class="iconfont" :class="(items.dayPercent < 0) ? 'icon-fall' : 'icon-rise'">
                            </i>{{Math.abs(items.dayPercent)}}%
                        </div>
                    </div>
                </Col>
            </Row>
            <Row type="flex" justify="space-between" class="detailPanel">
                <div class="detailLeft commonStyle">
                    <div class="detailPart">
                            <div class="detailCont">
                                <ul class="topTitle">
                                    <span class="title">服务调用Top5</span>
                                    <span class="more" @click="moreClick('serviceTop')">更多</span>
                                </ul>
                                <ul class="topCont">
                                    <div v-if="serviceTop.loading"></div>
                                    <div v-if="!serviceTop.loading">
                                        <div class="topContLeft">
                                            <li v-for="i in 5" :key="i"><span :class="((i != 4) && (i != 5)) ? '' : 'rankCircle' ">{{i}}</span></li>
                                        </div>
                                        <div class="topContRight">
                                            <vertical-bar-chart :id="serviceTop.id" :option="serviceTop.serviceTopData" :style="serviceTop.style"></vertical-bar-chart>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                            <div class="detailCont">
                                <ul class="topTitle">
                                    <span class="title">活跃用户Top5</span>
                                    <span class="more" @click="moreClick('userTop')">更多</span>
                                </ul>
                                <ul class="topCont">
                                    <div v-if="serviceTop.loading"></div>
                                    <div v-if="!serviceTop.loading">
                                        <div class="topContLeft">
                                             <li v-for="i in 5" :key="i"><span :class="((i != 4) && (i != 5)) ? '' : 'rankCircle' ">{{i}}</span></li>
                                        </div>
                                        <div class="topContRight">
                                            <vertical-bar-chart :id="userTop.id" :option="userTop.userTopData" :style="userTop.style"></vertical-bar-chart>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    <div class="detailPart">
                        <div class="detailCont">
                            <!-- 异常服务 -->
                            <div v-if="serviceAbnormal.loading"></div>
                            <marquee v-if="!serviceAbnormal.loading"  :marqueeData="serviceAbnormal.data" :marqueeTitle = "serviceAbnormal.title" :marqueeLength = 5 @moreClick="moreClick('abnormalService')"></marquee>
                        </div>
                        <div class="detailCont">
                            <!-- 异常用户 -->
                            <div v-if="userAbnormal.loading"></div>
                            <marquee v-if="!userAbnormal.loading" :marqueeData="userAbnormal.data" :marqueeTitle = "userAbnormal.title" :marqueeLength = 5 @moreClick="moreClick('abnormalUser')"></marquee>
                        </div>
                    </div>   
                  
                </div>
                <div class="detailRight commonStyle">
                    <div class="userDynamicsPanel">
                        <ul class="topTitle">
                            <span class="title">用户动态</span>
                        </ul>
                        <ul class="topCont" style="height:436px">
                            <div style="text-align: center;line-height: 436px;" v-if="callLog.loading">{{callLog.loadTips}}</div>
                            <li v-if="!callLog.loading" v-for="items in overviewUserLog">
                                <div class="userLogCont" :title="items.username+items.server+items.time">
                                    <span class="userLine"></span>
                                    <span class="userBlank">{{items.username}}</span>
                                    <span class="userServer">{{items.server}}</span>
                                    <span class="date">{{items.time}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- <div class="normal-block-mod">
                        <div class="mormal-block-hd ivu-row">
                            <h2 class="mbm-title">用户动态</h2>
                        </div>
                        <div class="mormal-block-bd">
                            <ul class="dynamic-list">
                                <div style="text-align: center;line-height: 126px;" v-if="callLog.loading">{{callLog.loadTips}}</div>
                                <li v-if="!callLog.loading" v-for="items in overviewUserLog"><b class="t-blank">{{items.username}}</b> {{items.server}}<span class="date">{{items.time}}</span></li>
                            </ul>
                        </div>
                    </div> -->
                </div>
            </Row>
            <Row type="flex" class="warningPanel">
                <div class="quotaWarningCont">
                    <!-- 配额预警 -->
                    <div v-if="quotaWarning.loading"></div>
                    <marquee v-if="!quotaWarning.loading"  :marqueeData="quotaWarning.data" :marqueeTitle = "quotaWarning.title" :marqueeLength = 5 @moreClick="moreClick('quotaWarning')"></marquee>
                </div>
                <div class="fundsWarningCont">
                    <!-- 账户预警 -->
                    <div v-if="fundsWarning.loading"></div>
                    <marquee v-if="!fundsWarning.loading"  :marqueeData="fundsWarning.data" :marqueeTitle = "fundsWarning.title" :marqueeLength = 5 @moreClick="moreClick('fundsWarning')"></marquee>
                </div>
            </Row>
        </Row>
        <div class="full-echart-panel mb-12">
            <div class="header">
                <h2 class="title">业务分析 <strong>{{businessSelectType}}业务总量分析</strong></h2>
            </div>
            <Row>
                <Col span="12">&nbsp;</Col>
                <Col span="12">
                    <Select v-model="echarts.business.select" @on-change="selectBusinessAnalysis" size="large" style="width:120px;float: right;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="content">
                <div class="business-analysis rel" style="height: 100%">
                    <Spin fix v-if="echarts.business.loading">
                        <div class="loader-spin">
                            <svg class="circular" viewBox="25 25 50 50">
                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
                    <leon-area-line-echart v-else :id="echarts.business.id" :option="echarts.business.option"></leon-area-line-echart>
                </div>
            </div>
        </div>

        <div class="full-echart-panel mb-12">
            <div class="header">
                <h2 class="title">流量分析 <strong>{{flowSelectType}}流量总量分析</strong></h2>
            </div>
            <Row>
                <Col span="12">&nbsp;</Col>
                <Col span="12">
                    <Select v-model="echarts.flow.select" @on-change="selectFlowAnalysis" size="large" style="width:120px;float: right;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="content">
                <div class="flow-analysis rel" style="height: 100%">
                    <Spin fix v-if="echarts.flow.loading">
                        <div class="loader-spin">
                            <svg class="circular" viewBox="25 25 50 50">
                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
                    <leon-area-line-echart :id="echarts.flow.id" :option="echarts.flow.option"></leon-area-line-echart>
                </div>
            </div>
        </div>

        <div class="full-echart-panel mb-12">
            <div class="header">
                <h2 class="title">用户分析 <strong>今日新增用户数：{{todayUserCount}} 人，当前用户总数：{{currentUserCount}} 人</strong></h2>
            </div>
            <Row>
                <Col span="12">&nbsp;</Col>
                <Col span="12">
                    <Select v-model="echarts.userLog.select" @on-change="selectUserLogAnalysis" size="large" style="width:120px;float: right;">
                        <Option v-for="item in selectTimeDict" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
            </Row>
            <div class="content">
                <div class="user-analysis rel" style="height: 100%">
                    <Spin fix v-if="echarts.userLog.loading">
                        <div class="loader-spin">
                            <svg class="circular" viewBox="25 25 50 50">
                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
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
    import { 
        ajaxGetServiceOverview, 
        ajaxGetAccessOverview, 
        ajaxGetServiceLogCount,
        ajaxGetAccessLogCount, 
        ajaxGetUserLogCount, 
        ajaxGetCallLog, 
        ajaxCurrentUserCount,
        ajaxGetServiceTopList,
        ajaxGetUserTopList,
        ajaxGetServiceAbnormalList,
        ajaxGetUserAbnormalList,
        ajaxGetInsufficientQuotaList,
        ajaxGetInsufficientFundsList } from 'src/service/sys'
    import * as method from 'src/util/sys/'

    import leonAreaLineEchart from "components/echarts/leon-area-line-chart";
    import verticalBarChart from 'components/echarts/vertical-bar-chart';
    import leonLineEchart from "components/echarts/leon-line-chart";
    import marquee from 'components/marquee'

    import fullScreen from "./components/fullScreen"

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'sys-scree',
        components: {
            leonAreaLineEchart,
            leonLineEchart,
            fullScreen,
            verticalBarChart,
            marquee
        },
        data() {
            return {
                selectTimeDict,
                echarts:{
                    business: {
                        loading: false,
                        select: 'todayOfHours',
                        id: 'business-analysis-echarts',
                        option: {},
                        style: ''
                    },
                    flow: {
                        select: 'todayOfHours',
                        id: 'flow-analysis-echarts',
                        option: {},
                        style: '',
                        loading: false
                    },
                    userLog: {
                        select: 'todayOfHours',
                        id: 'userLog-analysis-echarts',
                        option: {},
                        style: '',
                        loading: false
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
                todayUserCount: 0,
                serviceTop:{
                    loading:false,
                    id:'serviceTopChart',
                    serviceTopData: [],
                    style:{
                         height: '160px'
                    }
                },
                userTop:{
                    loading:false,
                    id:'userTopChart',
                    userTopData: [],
                    style:{
                         height: '160px'
                    }
                },
                serviceAbnormal:{
                    data:[],
                    loading:false,
                    title:'异常服务',
                },
                userAbnormal:{
                    data:[],
                    loading:false,
                    title:'异常用户',
                },
                quotaWarning:{
                    data:[],
                    loading:false,
                    title:'配额不足预警',
                },
                fundsWarning:{
                    data:[],
                    loading:false,
                    title:'余额不足账户预警',
                },
                moreClickType:[
                    {
                        type:'serviceTop',
                        to:'service',
                        params:''
                    },
                    {
                        type:'userTop',
                        to:'list',
                        params:''
                    },
                    {
                        type:'abnormalService',
                        to:'service',
                        params:''
                    },
                    {
                        type:'abnormalUser',
                        to:'list',
                        params:''
                    },
                    {
                        type:'quotaWarning',
                        to:'list',
                        params:''
                    },
                    {
                        type:'fundsWarning',
                        to:'list',
                        params:''
                    }
                ],
            }
        },
        methods: {
            ...mapActions([ 'recordOverviewAccess', 'recordOverviewService', 'recordUserLog' ]),
            closeFullScree(){
                this.fullScreen.state = false;
                // document.getElementById('singlePageBox').style.overflow = 'auto'
            },
            showFullScree(){ // 大屏展示
                this.fullScreen.state = true;
                // document.getElementById('singlePageBox').style.overflow = 'hidden'
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
                const self = this;
                this.echarts.userLog.loading = true;
                ajaxGetUserLogCount(params).then(res => {
                    if(res.state === 0){
                        if(callback && typeof callback === "function"){
                            callback(res.data.countList)
                        }
                        self.echarts.userLog.loading = false;
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
                const self = this;
                this.echarts.flow.loading = true;
                ajaxGetAccessLogCount(params).then(res => {
                    if(res.state === 0){
                        if(callback && typeof callback === "function"){
                            callback(res.data.countList)
                        }
                        self.echarts.flow.loading = false;
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
                const self = this;
                this.echarts.business.loading = true;
                ajaxGetServiceLogCount(params).then(res => {
                    if(res.state === 0){
                        if (callback && typeof callback === "function") {
                            callback(res.data.countList);
                        }
                        self.echarts.business.loading = false;
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
                        self.todayUserCount = res.data.countList[0].doc_count;
                    }
                })
            },
            getServiceTopList(){
                const self = this;
                self.serviceTop.loading = true;
                ajaxGetServiceTopList().then(res => {
                    if(res.data){
                        var arrData = res.data.data;
                        self.serviceTop.serviceTopData = arrData.map(item => ({ name:item.serviceName,value:item.value }));
                        self.serviceTop.loading = false;
                    }
                })
            },
            getUserTopList(){
                const self = this;
                self.userTop.loading = true;
                ajaxGetUserTopList().then(res => {
                    if(res.data){
                        var arrData = res.data.data;
                        self.userTop.userTopData = arrData.map(item => ({name:item.userName,value:item.value}));
                        self.userTop.loading = false;
                    }
                })
            },
            moreClick(type){
                this.moreClickType.map(item => {
                    if(item.type == type){
                        this.$router.push({
                            name: item.to,
                            query: item.params
                        });
                    }
                })
            },
            getServiceAbnormalList(){
                const self = this;
                self.serviceAbnormal.loading = true;
                ajaxGetServiceAbnormalList().then(res => {
                    if(res.data){
                        var arrData = res.data.data;
                        self.serviceAbnormal.data = arrData.map(item => ({title:item.serviceName,info:item.info,createTime:item.createTime}));
                        self.serviceAbnormal.loading = false;
                    }
                })
            },
            getUserAbnormalList(){
                const self = this;
                self.userAbnormal.loading = true;
                ajaxGetUserAbnormalList().then(res => {
                    if(res.data){
                        var arrData = res.data.data;
                        self.userAbnormal.data = arrData.map(item => ({title:item.userName,info:item.info,createTime:item.createTime}));
                        self.userAbnormal.loading = false;
                    }
                })
            },
            getInsufficientQuotaList(){
                const self = this;
                self.quotaWarning.loading = true;
                ajaxGetInsufficientQuotaList().then(res => {
                    if(res.data){
                        var arrData = res.data.data;
                        self.quotaWarning.data = arrData.map(item => ({title:item.userName, title1:item.appName, title2:item.serviceName, info:item.info,createTime:item.createTime}));
                        self.quotaWarning.loading = false;
                    }
                })
            },
            getInsufficientFundsList(){
                const self = this;
                self.fundsWarning.loading = true;
                ajaxGetInsufficientFundsList().then(res => {
                    if(res.data){
                        var arrData = res.data.data;
                        self.fundsWarning.data = arrData.map(item => ({title:item.userName,info:item.info,createTime:item.createTime}));
                        self.fundsWarning.loading = false;
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
                this.getTodayUserCount();
                //获取服务top
                this.getServiceTopList();
                //获取用户top
                this.getUserTopList();
                //获取异常服务
                this.getServiceAbnormalList();
                //获取异常用户
                this.getUserAbnormalList();
                //获取配额不足预警
                this.getInsufficientQuotaList();
                //获取余额不足账户
                this.getInsufficientFundsList();
            }
        },
        created: function() {
            this.init()
        },
        computed: {
            ...mapGetters([ 'overviewAccess', 'overviewService', 'overviewUserLog' ]),
            businessSelectType(){
                const self = this;
                return this.selectTimeDict.find(v => v.value === self.echarts.business.select).label
            },
            flowSelectType(){
                const self = this;
                return this.selectTimeDict.find(v => v.value === self.echarts.flow.select).label
            }
        }
    };
</script>

<style lang="less">
.mb-12 {
  margin-bottom: 22px;
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
    margin-bottom: 22px;
  .ivu-col {
    background: #fff;
    width: 23%;
    // height: 100%;
    padding: 20px 30px;
  }

  .name{
      line-height: 46px;
      font-size: 16px;
      color: #666;

  }
  .num{
       line-height: 58px;
       font-size: 30px;
       font-weight: bold;
       color: #333;
  }
  .info{
        color: #999;
        font-size: 14px;
        .infoItem{
            width: 48%;
            float: left;
            line-height: 50px;

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

.detailPanel{

    .detailLeft{
        float: left;
        width: 70%;
        .detailPart{
            height: 236px;
            margin-bottom: 22px;
            .detailCont{
                float: left;
                width: 46%;
                margin-right: 4%;
                background: #fff;      
                .topContLeft{
                    width: 8%;
                    float: left;
                    margin-right: 6px;
                    li{
                        text-align: center;
                        font-size: 14px;
                        height: 32px;
                        line-height: 32px;
                        position: relative;
                        span{
                            width: 20px;
                            height: 20px;
                            position: absolute;
                            top:6px;
                            left: 6px;
                            color:#fff;
                            line-height: 20px;
                            background-color: #314659;
                            border-radius: 50%;
                        } 
                        .rankCircle{
                            color: #333 !important;
                            background-color: #f0f2f5 !important; 
                        }
                    }
                    
                }
                .topContRight{
                    width: 90%;
                    float: left;
                }
            }
        }
    }
    .detailRight{
        float: left;
        width: 30%;
        .userDynamicsPanel{
           background: #fff;
           li{
               position: relative;
                .userLogCont{
                        width: calc(100% - 40px);
                        height: 32px;
                        margin-left: 40px;
                        text-align: left;
                        line-height: 32px;
                        font-size: 14px;
                        clear: both;
                        position: relative;
                    .userLine{
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        left: -34px;
                        top:10px;
                        border:2px solid #108EFF;
                        border-radius: 50%;
                        background-color:#fff;
                    }
                    .userBlank{
                        float: left;
                        font-weight: bold;
                        color: #333;
                        width: 15%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .userServer{
                            float: left;
                            width: 45%;
                            margin-left: 6px;
                            color:#108EFF;  
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                    }
                    .date{
                        float: right;
                        width: 35%;
                        color: #666;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
           } 
           li:not(:last-child) > .userLogCont::before{
                content: '';
                height: 30px;
                border-left: 2px solid #f0f0f0;
                position: absolute;
                top:10px;
                left: -29px; 
           }

        }
    }
}

.warningPanel{
    .quotaWarningCont{
        float: left;
        width: 48%;
        margin-right:3%;
    }
    .fundsWarningCont{
        float: left;
        width: 49%;
    }
}

.dataScreenWrapper{

    .commonStyle{  

        .topTitle{
                height: 56px;
                border-bottom: 1px solid rgb(233, 233, 233);
                .title{
                    float: left;
                    padding-left: 24px;
                    font-size: 16px;
                    line-height: 56px;
                    font-weight: bold;
                    text-align: center;
                }
                .more{
                    float: right;
                    padding-right: 24px;
                    font-size: 12px;
                    line-height: 56px;
                    text-align: center;
                    color:#108EFF;
                    cursor: pointer;
                }
            }
            .topCont{
                padding: 10px 24px;
                height: 180px;
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