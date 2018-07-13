<template>
    <div id="fullScreen" class="fullScreen">
        <div class="close" @click="close"><i class="iconfont icon-close"></i></div>

        <h1 class="title">国信达能力开放平台监控系统</h1>

        <div class="Map">
            <div class="loading" v-if="echartsMap.loading">{{echartsMap.loadTips}}</div>
            <leon-map-chart v-if="!echartsMap.loading" :id="echartsMap.id" :option="echartsMapOption"></leon-map-chart>
        </div>

        <div class="PanelLeft">

        </div> <!-- 左侧面板 -->
        <div class="PanelRight">

        </div> <!-- 右侧面板 -->
        <div class="PanelBottom">

        </div> <!-- 底部面板 -->
    </div>
</template>

<script>
    import leonMapChart from "components/echarts/leon-map-chart";
    import geoCoordMap from "src/util/sys/china-cities"
    import { ajaxGetCityInfo } from 'src/service/sys'
    import echartsConfig from "src/config/echartsConfig";

    export default {
        name: 'sys-scree',
        components: {
            leonMapChart
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
            }
        },
        created(){
            this.getMapCityInfo()
        }
    }
</script>

<style lang="less">
    @import "./fullScreen.less";
</style>
