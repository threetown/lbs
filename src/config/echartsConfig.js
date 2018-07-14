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
            // if(formatter && typeof formatter === "function"){
            //     tooltip.formatter = formatter()
            // }
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
    },
    darkPieChartOptions(params){
        let option = {
            tooltip: echartsConfig.darkThemeColor.lineTooltip(),
            color: ['#3ab4ff', '#1b88c2', '#ff8421'],
            series: [{
                type: 'pie',
                name: '',
                radius: ['0%', '100%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                silent: true,
                data: [{
                    value: 1,
                    itemStyle: {
                        normal: {
                            color: 'rgba(20, 176, 233, .1)',
                            shadowBlur: 50,
                            shadowColor: '#26718C'
                        }
                    }
                }]
            }, {
                name: '',
                type:'pie',
                radius :['35%', '75%'],
                center: ['50%', '50%'],
                data: params ? params  : [{value:30, name:'未上线'}, {value:80, name:'正常服务'}, {value:10, name:'异常服务'}].sort(function (a, b) { return b.value - a.value}),
                roseType: 'angle',
                hoverAnimation: false
            }]
        };
        return option;
    },
    darkScatterOptions(params){
        // 数据处理，从大到小
        let plantCap = params ? params : [
            { name: '北京', value: '222' },
            { name: '上海', value: '315' },
            { name: '广州', value: '113' },
            { name: '深圳', value: '95' },
            { name: '武汉', value: '92' },
            { name: '仙桃', value: '87' },
            { name: '大理', value: '60' },
            { name: '成都', value: '55' },
            { name: '青岛', value: '52' },
            { name: '南京', value: '47' },
            { name: '江苏', value: '40' }
        ].sort(function (a, b) { return b.value - a.value})
            
        // 预设点位
        let datalist = [
            { offset: [61, 42], symbolSize: 70 },
            { offset: [24, 45], symbolSize: 62 },
            { offset: [87, 54], symbolSize: 54 },
            { offset: [40, 14], symbolSize: 48 },
            { offset: [42, 60], symbolSize: 42 },
            { offset: [77, 20], symbolSize: 38 },
            { offset: [100, 30], symbolSize: 36 },
            { offset: [8, 26], symbolSize: 34 },
            { offset: [1, 50], symbolSize: 30 },
            { offset: [-6, 26], symbolSize: 26 },
            { offset: [108, 60], symbolSize: 26 }
        ]

        // 合并
        for (let i = 0; i < plantCap.length; i++) {
            const e = plantCap[i];
            datalist[i].offset.push(e.value)            
        }

        let datas = [];
        let color = 'rgba(20, 176, 233, .4)';
        for (let i = 0; i < plantCap.length; i++) {
            let item = plantCap[i];
            let itemToStyle = datalist[i];
            
            datas.push({
                name: item.name,
                value: itemToStyle.offset,
                symbolSize: itemToStyle.offset[2] * 50, // TODO，大小
                label: { normal: { textStyle: { fontSize: 12 } }},
                itemStyle: { normal: { color: 'rgba(20, 176, 233, .4)' } }
            })
        }

        let option = {
            title: {
                text: '用户所在地区分布情况',
                textStyle: echartsConfig.darkThemeColor.titleStyle
            },
            tooltip: echartsConfig.darkThemeColor.lineTooltip(),
            grid: { show: false, top: 10, bottom: 10 },
            xAxis: [{ gridIndex: 0, type: 'value', show: false, min: 0, max: 100, nameLocation: 'middle', nameGap: 5 }],
            yAxis: [{ gridIndex: 0, min: 0, show: false, max: 100, nameLocation: 'middle', nameGap: 30 }],
            series: [{ type: 'scatter', symbol: 'circle', symbolSize: 120,
                label: { 
                    normal: { show: true, formatter: '{b}', color: '#A7E8FF', textStyle: { fontSize: '12' }},
                },
                itemStyle: { normal: { color: '#00acea' } },
                data: datas
            }]
        }
        option.tooltip.formatter = function(obj){
            let info = obj.data;
            return info.name + '：' + info.value[2] + '人'
        }
        return option;
    },
    darkVerticalBarChartOptions(params){
        let seriesData = {
            data: [],
            name: [],
            backData: []
        }
        if(params && params instanceof Array){
            seriesData.name = params.map(item => item.name)
            seriesData.data = params.map(item => item.value).sort(function (a, b) { return b.value - a.value})
            let maxArr = [];
            let maxNum = seriesData.data[0] * 8;
            for (let i = 0; i < params.length; i++) {
                maxArr.push(maxNum)
            }
            seriesData.backData = maxArr
        }

        let option = {
            grid: { left: '0', top:'6%', right: '5%', bottom: '0', containLabel: true },
            xAxis: {
                type: 'value',
                show: true,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            yAxis: [{
                type: 'category',
                axisLine: { show: false },
                splitLine: { show: false }
            }, {
                type: 'category',
                position: "left",
                data: seriesData.name,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: true, color: echartsConfig.darkThemeColor.axisLabel },
                splitLine: { show: false }
            }],
            series: [{
                name: '',
                type: 'bar',
                barWidth: 12,
                silent: true,
                yAxisIndex: 0,
                label: {
                    normal: {
                        show: true,
                        color: echartsConfig.darkThemeColor.axisLabel,
                        formatter: function(data) {
                            return seriesData.data[data.dataIndex];
                        },
                        position: 'right'
                    }
                },
                itemStyle: { normal: { color: '#292B2D', barBorderRadius: 20 }},
                data: seriesData.backData // max * .9
            }, {
                name: '',
                type: 'bar',
                barWidth: 12,
                silent: false,
                yAxisIndex: 1,
                label: { normal: { show: false }},
                itemStyle: {
                    normal: {
                        barBorderRadius: 10,
                        color: {
                            type: 'bar',
                            colorStops: [
                                { offset: 0, color: '#00ffa8' },
                                { offset: 1, color: '#ffea00' }
                            ],
                            globalCoord: false, // 缺省为 false
                        }
                    }
                },
                data: seriesData.data.map(function(item, index) {
                    return parseInt(item / seriesData.backData[index] * 100)
                })
            }]
        };
        return option;
    }
}

export default echartsConfig;