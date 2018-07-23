<template>
    <div id="fullScreen" class="fullScreen">
        <div class="close" @click="close"><i class="iconfont icon-close"></i></div>

        <h1 class="title">国信达安全总控平台</h1>

        <div class="Map">
            <div class="loading" v-if="echartsMap.loading">{{echartsMap.loadTips}}</div>
            <leon-map-chart v-if="!echartsMap.loading" :id="echartsMap.id" :option="echartsMapOption" :style="echartsMap.style"></leon-map-chart>
        </div>

        <div class="PanelTop">
            <li v-for="items in overviewService" :class="items.type">
                <div class="tips">{{items.name}}</div>
                <div class="num">{{items.value}}</div>
            </li>
        </div>

        <div class="PanelLeft">
            <div class="box" style="height: 2.77rem;">
                <div class="loading" v-if="echartsLineBar.loading">{{echartsLineBar.loadTips}}</div>
                <leon-line-bar-chart v-if="!echartsLineBar.loading" :id="echartsLineBar.id" :option="echartsLineBar.option" :style="echartsLineBar.style"></leon-line-bar-chart>
            </div>
            <div class="box" style="height: 1.81re">
                <div class="loading" v-if="echartsMap.loading">{{echartsMap.loadTips}}</div>
                <leon-dark-scatter-chart v-if="!echartsMap.loading" :id="echartsScatter.id" :option="echartsScatter.option" :style="echartsScatter.style"></leon-dark-scatter-chart>
            </div>
            <div class="box" style="height: 2.60rem">
                <div class="loading" v-if="userCount.loading">{{userCount.loadTips}}</div>
                <leon-dark-area-line-chart v-if="!userCount.loading" :id="echartsUserAreaLine.id" :option="echartsUserAreaLine.option" :style="echartsUserAreaLine.style"></leon-dark-area-line-chart>
            </div>
            <div class="box" style="height: 2.60rem">
                <div class="loading" v-if="userCount.loading">{{userCount.loadTips}}</div>
                <leon-dark-area-line-chart v-if="!userCount.loading" :id="echartsAccessAreaLine.id" :option="echartsAccessAreaLine.option" :style="echartsAccessAreaLine.style"></leon-dark-area-line-chart>
            </div>
        </div> <!-- 左侧面板 -->
        <div class="PanelRight">
            <div class="box" style="height: 2.6rem">
                <div class="loading" v-if="echartsBusinessAreaLine.loading">{{echartsBusinessAreaLine.loadTips}}</div>
                <leon-dark-area-line-chart v-if="!echartsBusinessAreaLine.loading" :id="echartsBusinessAreaLine.id" :option="echartsBusinessAreaLine.option" :style="echartsBusinessAreaLine.style"></leon-dark-area-line-chart>
            </div>
            <div class="box">
                <div class="commonTitle">服务使用情况排名</div>
                <div style="text-align: right">
                    <RadioGroup class="custom-dark-button-radio" type="button" v-model="serverType.value" @on-change="getServerRank">
                        <Radio :label="items.label" v-for="items in serverType.list" :key="items.value"></Radio>
                    </RadioGroup>
                </div>
                <leon-dark-vertical-bar-chart :id="echartsServiceTopBar.id" :option="echartsServiceTopBar.option" :style="echartsServiceTopBar.style"></leon-dark-vertical-bar-chart>
            </div>
            <div class="box">
                <div class="commonTitle">服务分析</div>
                <div class="clearfix">
                    <ul class="serverAnalysisList">
                        <li v-for="items in echartsServicePie.option">
                            <div class="label">{{items.name}}</div>
                            <div class="value">{{items.value}}</div>
                        </li>
                    </ul>
                    <div style="height: 2rem;width: 3rem;float: right;">
                        <leon-dark-pie-chart :id="echartsServicePie.id" :option="echartsServicePie.option" :style="echartsServicePie.style"></leon-dark-pie-chart>
                    </div>
                </div>
            </div>
            <div class="box">
                <div class="commonTitle">实时动态</div>
                <ul class="logList">
                    <div class="loading" v-if="!overviewUserLog.length">暂无数据</div>
                    <li v-if="overviewUserLog.length" v-for="items in overviewUserLog"><Icon type="volume-medium"></Icon><b class="t-gray">{{items.username}}</b><b class="t-blue">{{items.server}}</b><span class="date">{{items.time}}</span></li>
                </ul>
            </div>
        </div> <!-- 右侧面板 -->
        <div class="PanelBottom">
            <ul class="list">
                <li v-for="items in overviewAccess">
                    <span class="name">{{items.name}}</span>
                    <span class="num">{{items.value}}</span>
                    <span class="info">昨日同比 <i class="iconfont" :class="(items.percent < 0) ? 'icon-fall' : 'icon-rise'"></i>{{Math.abs(items.percent)}}%</span>
                </li>
            </ul>
        </div> <!-- 底部面板 -->
    </div>
</template>

<script>
    import leonMapChart from "components/echarts/leon-map-chart";
    import leonLineBarChart from "components/echarts/leon-line-bar-chart";
    import leonDarkAreaLineChart from "components/echarts/leon-dark-area-line-chart";
    import leonDarkVerticalBarChart from "components/echarts/leon-dark-vertical-bar-chart";
    import leonDarkPieChart from "components/echarts/leon-dark-pie-chart";
    import leonDarkScatterChart from "components/echarts/leon-dark-scatter-chart";

    
    import geoCoordMap from "src/util/sys/china-cities"
    import { ajaxGetCityInfo, ajaxGetServerInfo, ajaxGetUserLogCount, ajaxGetAccessLogCount, ajaxGetServiceLogCount, ajaxGetServerRank } from 'src/service/sys'
    import echartsConfig from "src/config/echartsConfig";

    import * as basicConfig from "src/config/basicConfig"
    import * as tools from 'src/util/tools'

    import * as method from 'src/util/sys/'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'sys-scree',
        components: {
            leonMapChart,
            leonLineBarChart,
            leonDarkAreaLineChart,
            leonDarkVerticalBarChart,
            leonDarkPieChart,
            leonDarkScatterChart
        },
        data() {
            return {
                echartsMap: {
                    id: 'map-echarts',
                    style: {
                        height: "7.4rem",
                        width: "10rem"
                    },
                    loading: false,
                    loadTips: '努力正在加载中...'
                },
                echartsMapOption: {
                    mapSeriesData: '',
                    scatterSeriesData: ''
                },
                echartsLineBar: {
                    id: 'line-bar-echarts',
                    style: {
                        height: '2.46rem'
                    },
                    option: {},
                    loading: false,
                    loadTips: '努力加载中...'
                },
                echartsAccessAreaLine: {
                    id: 'access-area-line-echarts',
                    style: {
                        height: '2.3rem'
                    },
                    option: {}
                },
                echartsUserAreaLine: {
                    id: 'user-area-line-echarts',
                    style: {
                        height: '2.3rem'
                    },
                    option: {}
                },
                echartsBusinessAreaLine: {
                    id: 'business-area-line-echarts',
                    style: {
                        height: '2.3rem'
                    },
                    option: {},
                    loading: false,
                    loadTips: '努力加载中...'
                },
                echartsServiceTopBar: {
                    id: 'echartsServiceTopBar',
                    style: {
                        height: '1.5rem'
                    },
                    option: []
                },
                echartsServicePie: {
                    id: 'echartsServicePie',
                    style: {
                        height: '2rem'
                    },
                    option: []
                },
                echartsScatter: {
                    id: 'echartsAccessScatter',
                    style: {
                        height: "1.61rem"
                    },
                    option: []
                },
                userCount: {
                    loading: false,
                    loadTips: '努力加载中...'
                },
                serverType: {
                    list: [],
                    value: ''
                }
            }
        },
        methods: {
            ...mapActions([ 'recordAccessIP' ]),
            close(){
                this.$emit("closeFullScreen");
            },
            getMapCityInfo(){
                const self = this;
                self.echartsMap.loading = true;
                ajaxGetCityInfo().then(res => {
                    if(res.state === 0){
                        let data = res.data.data;
                        self.recordAccessIP(data);

                        let echartsMapOption = self.echartsMapOption
                        echartsMapOption.mapSeriesData = echartsConfig.getMap('china', self.accessIPProvince);
                        echartsMapOption.scatterSeriesData = self.convertData(self.accessIPCity);
                        self.echartsScatter.option = self.accessIPCity;
                        self.echartsMap.loading = false;
                    }else{
                        self.echartsMap.loadTips = '糟糕，加载失败！'
                    }
                })
            },
            convertData(resourceArr) {
                var res = [];
                if(resourceArr && resourceArr instanceof Array){
                    for (var i = 0; i < resourceArr.length; i++) {
                        var geoCoord = geoCoordMap[resourceArr[i].name];
                        if (geoCoord) {
                            res.push({
                                name: resourceArr[i].name,
                                value: geoCoord.concat(resourceArr[i].value)
                            });
                        }
                    }
                }
                return res;
            },
            getServerInfo(){
                const self = this;
                ajaxGetServerInfo().then(res => {
                    if(res.state === 0){
                        self.echartsServicePie.option = res.data.data;
                    }
                })
            },
            getUserLogCount(){
                const self = this;
                self.echartsLineBar.loading = true;
                ajaxGetUserLogCount('monthOfDays').then(res => {
                    if(res.state === 0){
                        let resourceArr = res.data.countList;
                        let nameArr = ["增长率", "新增用户"];
                        let fieldArr = ["incre_percent", "doc_count"];
                        self.echartsLineBar.option = method.convertUserLineAreaEchartData(resourceArr, fieldArr, nameArr)
                        self.echartsLineBar.loading = false;
                    }else{
                        self.echartsLineBar.loadTips = '糟糕，数据加载失败！'
                    }
                })
            },
            selectFlowAnalysis(){
                const self = this;
                let params = 'monthOfDays';
                this.getFlowAnalysis(params, function(value){
                    self.echartsUserAreaLine.option = method.convertFlowLineAreaEchartData(value,['user_count'], ['访问人数']);
                    self.echartsAccessAreaLine.option = Object.assign({ title: '本月访问次数统计'}, method.convertFlowLineAreaEchartData(value,['access_count'], ['访问次数']));
                })
            },
            getFlowAnalysis(params, callback){
                const self = this;
                this.userCount.loading = true;
                ajaxGetAccessLogCount(params).then(res => {
                    if(res.state === 0){
                        if(callback && typeof callback === "function"){
                            callback(res.data.countList)
                        }
                        self.userCount.loading = false;
                    }else{
                        self.userCount.loadTips = '糟糕，数据加载失败！'
                    }
                })
            },
            selectBusinessAnalysis(){
                const self = this;
                let params = 'todayOfHours';
                this.getBusinessAnalysis(params, function(value){
                    self.echartsBusinessAreaLine.option = Object.assign({ title: '每日新增业务统计'}, method.convertLineAreaEchartData(value, ['业务总量']));
                })
            },
            getBusinessAnalysis(params, callback){
                const self = this;
                this.echartsBusinessAreaLine.loading = true;
                ajaxGetServiceLogCount(params).then(res => {
                    if(res.state === 0){
                        if (callback && typeof callback === "function") {
                            callback(res.data.countList);
                        }
                        self.echartsBusinessAreaLine.loading = false;
                    }else{
                        self.echartsBusinessAreaLine.loadTips = '糟糕，数据加载失败！'
                    }
                })
            },
            getServerRank(){
                const self = this;
                let params = this.serverTypeId;
                ajaxGetServerRank(params).then(res => {
                    if(res.state === 0){
                        let data = res.data.data;
                        self.echartsServiceTopBar.option = data;
                    }
                })
            },
            init(){
                this.serverType.list = basicConfig.serverType;
                this.serverType.value = basicConfig.serverType[0].label;

                this.getMapCityInfo() // 地图
                this.getServerInfo() // 服务分析
                this.getUserLogCount() // 新增用户统计
                this.selectFlowAnalysis() // 访问统计
                this.selectBusinessAnalysis() // 每日新增业务
                this.getServerRank()
            }
        },
        created(){
            this.init()
        },
        computed: {
            ...mapGetters([ 'overviewAccess', 'overviewService', 'accessIPProvince', 'accessIPCity', 'overviewUserLog' ]),
            serverTypeId(){
                const self = this;
                return tools.getDictData(basicConfig.serverType, self.serverType.value, 'value')
            }
        }
    }
</script>

<style lang="less">
    @import "./fullScreen.less";
</style>
