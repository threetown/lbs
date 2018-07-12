import echarts from "echarts";

const echartsConfig = {
    itemColor: ["#0087f1", "#00A85B"],
    labelColor: ['#999'],
    lineColor: ['#e7e7ee'],
    areaColor: ['#fafafa'],
    color: ["#6b4ce4","#3c6be0","#52a5e5","#69d3e7"],
    init(params){
        let EChart = echarts.init(document.getElementById(params.id));
        let option = params.option;
        if (option && typeof option === "object") {
            EChart.setOption(option, true);
        }
        echartsConfig.resize(EChart)
    },
    resize(obj) {
        window.addEventListener('resize', function () {
            obj.resize()
        }.bind(this))
    },
    lineAreaChartOptions(params){
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: { color: '#5dbef6' },
                axisPointer: { lineStyle: { color: '#e7e7ee' }},
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            grid: {
                left: '0',
                right: '0',
                bottom: '0',
                top: '6%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    splitLine: {
                        show: true,
                        interval: 'auto',
                        lineStyle: {
                            color: this.lineColor
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: this.lineColor
                        }
                    },
                    axisLabel: { textStyle: { color: this.labelColor } },
                    data: params && params.xAxisData ? params.xAxisData : []
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitLine: { lineStyle: { color: this.lineColor } },
                    axisTick: { show: false },
                    axisLine: { lineStyle: { color: this.lineColor } },
                    axisLabel: { textStyle: { color:  this.labelColor} },
                    gridIndex: 0,
                    splitArea: { show: true, areaStyle: { color: this.areaColor }}
                }
            ],
            series : [
                {
                    name: params && params.seriesData && params.seriesData.name ? params.seriesData.name : '总量',
                    type:'line',
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(150, 201, 254,0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(150, 201, 254,0.2)'
                            }], false)
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: this.itemColor[0]
                        }
                    },
                    data: params && params.seriesData ? params.seriesData : []
                }
            ]
        };
        
        return option;
    }
}

export default echartsConfig;