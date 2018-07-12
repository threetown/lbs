import echarts from "echarts";

const echartsConfig = {
    labelColor: ['#999'],
    lineColor: ['#e7e7ee'],
    areaColor: ['#fafafa'],
    color: ["#6b4ce4","#3c6be0","#52a5e5","#69d3e7"],
    itemColor: ["#0087f1", "#00A85B"],
    AreaStyleColor: [
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(150, 201, 254,0.5)' },
            { offset: 1, color: 'rgba(150, 201, 254,0.2)' }
        ], false),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 168, 91, .5)' },
            { offset: 1, color: 'rgba(0, 168, 91, .2)' }
        ], false)
    ],
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
                textStyle: { color: '#5dbef6', align: 'left' },
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
                    name: '总量',
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
                    data: [0]
                }
            ]
        };

        // 处理 series值
        if(params && params.seriesData){
            let optionSeries = params.seriesData;
            let seriesData = [];
            console.log(optionSeries, 111)
            for (let i = 0; i < optionSeries.length; i++) {
                seriesData.push({
                    name: optionSeries[i].name ? optionSeries[i].name : '数据总量',
                    data: optionSeries[i].data,
                    type: 'line',
                    itemStyle: {
                        normal: { color: echartsConfig.itemColor[i] }
                    },
                    areaStyle: {
                        normal: {
                            color: echartsConfig.AreaStyleColor[i]
                        }
                    }
                })
            }
            option.series = seriesData;
        }
        
        return option;
    },
    lineChartOptions(params){
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
            xAxis: {
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
                data: params && params.xAxisData ? params.xAxisData : ['周一','周二','周三','周四','周五','周六','周日']
            },
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
            color: echartsConfig.itemColor,
            series: [
                {
                    name:'用户总数',
                    type:'line',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'新增用户',
                    type:'line',
                    data: [120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };
        
        // 处理 series值
        if(params && params.seriesData){
            let optionSeries = params.seriesData;
            let seriesData = [];
            for (let i = 0; i < optionSeries.length; i++) {
                seriesData.push({
                    name: optionSeries[i].name ? optionSeries[i].name : '数据总量',
                    data: optionSeries[i].data,
                    type: 'line'
                })
            }
            option.series = seriesData;
        }
        return option;
    }
    
}

export default echartsConfig;