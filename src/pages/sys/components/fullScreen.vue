<template>
    <div id="fullScreen" class="fullScreen">
        <div class="close" @click="close"><i class="iconfont icon-close"></i></div>

        <h1 class="title">国信达能力开放平台监控系统</h1>

        <div class="Map">
            <div class="loading" v-if="echartsMap.loading">{{echartsMap.loadTips}}</div>
            <leon-map-chart v-if="!echartsMap.loading" :id="echartsMap.id" :option="echartsMapOption"></leon-map-chart>
        </div>

        <div class="PanelTop">
            <li v-for="items in overviewService" :class="items.type">
                <div class="tips">{{items.name}}</div>
                <div class="num">{{items.value}}</div>
            </li>
        </div>

        <div class="PanelLeft">
            <div class="box">
                <leon-line-bar-chart :id="echartsLineBar.id" :option="echartsLineBar.option"></leon-line-bar-chart>
            </div>
            <div class="box">
                <leon-dark-area-line-chart :id="echartsUserAreaLine.id" :option="echartsUserAreaLine.option"></leon-dark-area-line-chart>
            </div>
            <div class="box">
                <leon-dark-area-line-chart :id="echartsAccessAreaLine.id" :option="echartsAccessAreaLine.option"></leon-dark-area-line-chart>
            </div>            
        </div> <!-- 左侧面板 -->
        <div class="PanelRight">
            <div class="box">
                <leon-dark-area-line-chart :id="echartsBusinessAreaLine.id" :option="echartsBusinessAreaLine.option"></leon-dark-area-line-chart>
            </div>
            <div class="box">
                <div class="commonTitle">服务使用情况排名</div>
                <div style="text-align: right">
                    <RadioGroup class="custom-dark-button-radio" type="button">
                        <Radio label="全部"></Radio>
                        <Radio label="基础地图"></Radio>
                        <Radio label="楼盘"></Radio>
                        <Radio label="专题"></Radio>
                    </RadioGroup>
                </div>
                <leon-dark-vertical-bar-chart :id="echartsServiceTopBar.id" :option="echartsServiceTopBar.option"></leon-dark-vertical-bar-chart>
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
                    <div style="height: 200px;width: 300px;float: right;">
                        <leon-dark-pie-chart :id="echartsServicePie.id" :option="echartsServicePie.option"></leon-dark-pie-chart>
                    </div>
                </div>
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

    
    import geoCoordMap from "src/util/sys/china-cities"
    import { ajaxGetCityInfo, ajaxGetServerInfo, ajaxGetUserLogCount } from 'src/service/sys'
    import echartsConfig from "src/config/echartsConfig";

    import * as method from 'src/util/sys/'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'sys-scree',
        components: {
            leonMapChart,
            leonLineBarChart,
            leonDarkAreaLineChart,
            leonDarkVerticalBarChart,
            leonDarkPieChart
        },
        data() {
            return {
                echartsMap: {
                    id: 'map-echarts',
                    style: '',
                    loading: false,
                    loadTips: '地图正在加载中...'
                },
                echartsMapOption: {
                    mapSeriesData: '',
                    scatterSeriesData: ''
                },
                echartsLineBar: {
                    id: 'line-bar-echarts',
                    option: {}
                },
                echartsAccessAreaLine: {
                    id: 'access-area-line-echarts',
                    option: {}
                },
                echartsUserAreaLine: {
                    id: 'user-area-line-echarts',
                    option: {}
                },
                echartsBusinessAreaLine: {
                    id: 'business-area-line-echarts',
                    option: {}
                },
                echartsServiceTopBar: {
                    id: 'echartsServiceTopBar',
                    option: {}
                },
                echartsServicePie: {
                    id: 'echartsServicePie',
                    option: []
                }
            }
        },
        methods: {
            close(){
                this.$emit("closeFullScreen");
            },
            getMapCityInfo(){
                const self = this;
                self.echartsMap.loading = true;
                ajaxGetCityInfo().then(res => {
                    if(res.state === 0){
                        let data = res.data.data;
                        let echartsMapOption = self.echartsMapOption
                        echartsMapOption.mapSeriesData = echartsConfig.getMap('china', data.provinceList);
                        echartsMapOption.scatterSeriesData = self.convertData(data.cityList);
                        self.echartsMap.loading = false;
                    }else{
                        self.echartsMap.loadTips = '糟糕，地图加载失败！'
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
                ajaxGetUserLogCount('monthOfDays').then(res => {
                    if(res.state === 0){
                        let resourceArr = res.data.countList;
                        let nameArr = ["增长率", "新增用户"];
                        let fieldArr = ["incre_percent", "doc_count"];
                        self.echartsLineBar.option = method.convertUserLineAreaEchartData(resourceArr, fieldArr, nameArr)
                    }
                })
            },
            
            init(){
                this.getMapCityInfo() // 地图
                this.getServerInfo() // 服务分析
                this.getUserLogCount() // 新增用户统计
            }
        },
        created(){
            this.init()
        },
        computed: {
            ...mapGetters([ 'overviewAccess', 'overviewService' ])
        }
    }
</script>

<style lang="less">
    @import "./fullScreen.less";
</style>
