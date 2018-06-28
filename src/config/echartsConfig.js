import echarts from "echarts";

const echartsConfig = {
    itemColor: ["#0087f1", "#00A85B"],
    labelColor: ['#999'],
    lineColor: ['#e7e7ee'],
    areaColor: ['#fafafa'],
    resize(obj) {
        window.addEventListener('resize', function () {
            obj.resize()
        }.bind(this))
    },
    lineAreaChartOptions(xAxisData, seriesData){
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
                    data:  xAxisData ? xAxisData : ['周一','周二','周三','周四','周五','周六','周日']
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
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
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
                    data: seriesData ? seriesData : [120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };
        
        return option;
    },
    lineChartOptions(xAxisData, seriesData){
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
                data: ['周一','周二','周三','周四','周五','周六','周日']
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
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'新增用户',
                    type:'line',
                    stack: '总量',
                    data: [120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };
        
        return option;
    },
}

export default echartsConfig;