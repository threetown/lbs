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
    darkThemeColor: {
        axisLabel: '#ccc', // 文字颜色
        lineStyle: '#3c3d3f', // 线颜色
        barItemColor: [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#14b0e9' },
                { offset: 0.5, color: '#027eff' },
                { offset: 1, color: '#0286ff' }
            ])
        ],
        AreaLineColor: '#14b0e9',
        AreaItemColor: [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(18, 57, 71, .5)' },
                { offset: 1, color: 'rgba(18, 57, 71, .2)' }
            ])
        ],
        lienItemColor: '#e2ff1d',
        titleStyle: {
            color: '#14b0e9',
            fontSize: '16'
        },
        grid: {
            left: '3%',
            top:'26%',
            right: '2%',
            bottom: '5%',
            containLabel: true
        },
        lineTooltip(trigger) {
            let tooltip = {
                show: true,
                trigger: trigger ? trigger : 'item', // axis
                backgroundColor: 'rgba(18, 57, 71, .8)',
                textStyle: { color: '#ccc', fontSize: 14 },
                // axisPointer: { type: 'shadow' },
                padding: [8]
            }
            return tooltip;
        },
    },
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
    getMap(mapName, resourceArr){
        let mapData = [];
        let mapFeatures = echarts.getMap(mapName).geoJson.features;
        mapFeatures.forEach(function(value) {
            let name = value.properties.name;
            let flag = false;
            if(resourceArr && resourceArr instanceof Array && resourceArr.length){
                for (let i = 0; i < resourceArr.length; i++) {
                    const element = resourceArr[i];
                    if(element.name === name){
                        mapData.push({ name, value: element.value })
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    mapData.push({ name, value: 0 })
                }
            }else{
                mapData.push({ name, value: 0 })
            }    
        });
        return mapData;
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
    },
    MapEChartsOptions(params){
        let option = {
            tooltip: {
                show: false
            },
            geo: {
                map: 'china',
                show: true,
                roam: false,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#091632',
                        borderColor: '#1773c3',
                        shadowColor: '#1773c3',
                        shadowBlur: 20
                    }
                }
            },
            series: [
                {
                    name: '用户数',
                    type: 'map',
                    map: 'china',
                    geoIndex: 1,
                    aspectScale: 0.75, //长宽比
                    label: {
                        normal: {
                            show: false,  // 是否显示城市名称
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    tooltip: {
                        show: true,
                        formatter: '{b}<br/>{a}：{c}人',
                        trigger: 'item',
                        backgroundColor: 'rgba(20, 176, 233, .4)',
                        textStyle: { color: '#ccc', fontSize: 14 },
                        axisPointer: {
                            type: 'shadow'
                        },
                        padding: [15, 12]
                    },
                    roam: false,
                    itemStyle: {
                        normal: {
                            areaColor: '#111c24',
                            borderColor: '#090e11',
                            borderWidth: 1
                        },
                        emphasis: {
                            areaColor: '#0c0e0d',
                            borderColor: '#373837'
                        }
                    },
                    data: params && params.mapSeriesData ? params.mapSeriesData : echartsConfig.getMap('china')
                },
                {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: params && params.scatterSeriesData ? params.scatterSeriesData : [
                        { name: '合肥', value: [117.27, 31.86, 0] }
                    ],
                    symbolSize: function (val) {
                        return val[2] / 0.5; // 处理散点图大小
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    },
                    hoverAnimation: false
                }
            ]
         }
         return option;
    },
    lineBarChartOptions(params){
        let option = {
            title: {
                text: '新增用户统计',
                textStyle: echartsConfig.darkThemeColor.titleStyle
            },
            legend: {
                orient: 'horizontal', // 'vertical'
                x: 'right', // 'center' | 'left' | {number},
                y: '30', // 'center' | 'bottom' | {number}
                textStyle: {color: '#61686b'},
                data: params && params.seriesData && params.seriesData instanceof Array ? params.seriesData.map(item => item.name) : []
            },
            grid: echartsConfig.darkThemeColor.grid,
            tooltip: echartsConfig.darkThemeColor.lineTooltip(),
            xAxis: [{
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine:{
                        lineStyle:{
                            color: echartsConfig.darkThemeColor.lineStyle,
                        }
                    },
                    axisLabel:{
                        color: echartsConfig.darkThemeColor.axisLabel
                    },
                    data: params && params.xAxisData ? params.xAxisData : []
                }
            ],
            yAxis: [{
                type: 'value',
                // name: '增长率',
                position: 'right',
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: { color: echartsConfig.darkThemeColor.lineStyle }
                },
                axisLabel: {
                    formatter: '{value}%',
                    color: echartsConfig.darkThemeColor.axisLabel
                }
            },{
                type: 'value',
                // name:'人',
                nameGap:35,
                position: 'left',
                nameTextStyle:{
                    color: echartsConfig.darkThemeColor.axisLabel,
                    fontSize:16,
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: { color: echartsConfig.darkThemeColor.lineStyle }
                },
                axisLabel: { color: echartsConfig.darkThemeColor.axisLabel }
            }],
            series: [
                {
                    name: '增长率',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: echartsConfig.darkThemeColor.lienItemColor
                        },
                    },
                    data: []
                },{
                    type: 'bar',
                    name: '用户数量',
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [30],
                            color: echartsConfig.darkThemeColor.barItemColor[0]
                        }
                    },
                    barWidth: '12',
                    data: []
                }
            ]
        };
        // 新方法处理 series的值
        if(params && params.seriesData){
            for (let i = 0, optionSeries = params.seriesData; i < optionSeries.length; i++) {
                option.series[i] = Object.assign(option.series[i], optionSeries[i])
            }
        }
        return option;
    },
    darkLineAreaChartOptions(params){
        console.log(params, 462)
        let option = {
            title: {
                text: params && params.title ? params.title : '本月访问人数统计',
                textStyle: echartsConfig.darkThemeColor.titleStyle
            },
            legend: {
                orient: 'horizontal', // 'vertical'
                x: 'right', // 'center' | 'left' | {number},
                y: '30', // 'center' | 'bottom' | {number}
                textStyle: {color: '#61686b'},
                data: params && params.seriesData && params.seriesData instanceof Array ? params.seriesData.map(item => item.name) : [],
            },
            tooltip: echartsConfig.darkThemeColor.lineTooltip('axis'),
            grid: echartsConfig.darkThemeColor.grid,
            xAxis : [
                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine:{
                        lineStyle:{
                            color: echartsConfig.darkThemeColor.lineStyle,
                        }
                    },
                    axisLabel:{
                        color: echartsConfig.darkThemeColor.axisLabel
                    },
                    data: params && params.xAxisData ? params.xAxisData : []
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    nameTextStyle:{ color: echartsConfig.darkThemeColor.axisLabel, fontSize:16 },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLine: { lineStyle: { color: echartsConfig.darkThemeColor.lineStyle } },
                    axisLabel: { color: echartsConfig.darkThemeColor.axisLabel }
                }
            ],
            series : [
                {
                    name: '访问人数',
                    type:'line',
                    areaStyle: {
                        normal: {
                            color: echartsConfig.darkThemeColor.AreaItemColor[0]
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: echartsConfig.darkThemeColor.AreaLineColor
                        }
                    },
                    smooth:true, //是否平滑处理值0-1,true相当于0.5
                    data: []
                }
            ]
        };
        // 新方法处理 series的值(处理指定个数用)
        if(params && params.seriesData){
            for (let i = 0, optionSeries = params.seriesData; i < optionSeries.length; i++) {
                option.series[i] = Object.assign(option.series[i], optionSeries[i])
            }
        }
        return option;
    }
}

export default echartsConfig;