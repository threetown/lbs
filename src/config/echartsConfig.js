import echarts from "echarts";

const echartsConfig = {
    labelColor: ['#999'],
    lineColor: ['#e7e7ee'],
    areaColor: ['#fafafa'],
    color: ["#6b4ce4", "#3c6be0", "#52a5e5", "#69d3e7"],
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
            left: '5%',
            top: '14%',
            right: '5%',
            bottom: '2%',
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
    init(params) {
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
    getMap(mapName, resourceArr) {
        let mapData = [];
        let mapFeatures = echarts.getMap(mapName).geoJson.features;
        mapFeatures.forEach(function (value) {
            let name = value.properties.name;
            let flag = false;
            if (resourceArr && resourceArr instanceof Array && resourceArr.length) {
                for (let i = 0; i < resourceArr.length; i++) {
                    const element = resourceArr[i];
                    if (element.name === name) {
                        mapData.push({ name, value: element.value })
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mapData.push({ name, value: 0 })
                }
            } else {
                mapData.push({ name, value: 0 })
            }
        });
        return mapData;
    },
    lineAreaChartOptions(params) {
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: { color: '#5dbef6', align: 'left' },
                axisPointer: { lineStyle: { color: '#e7e7ee' } },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            grid: {
                left: '0',
                right: '2%',
                bottom: '0',
                top: '6%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
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
            yAxis: [
                {
                    type: 'value',
                    splitLine: { lineStyle: { color: this.lineColor } },
                    axisTick: { show: false },
                    axisLine: { lineStyle: { color: this.lineColor } },
                    axisLabel: { textStyle: { color: this.labelColor } },
                    gridIndex: 0,
                    splitArea: { show: true, areaStyle: { color: this.areaColor } }
                }
            ],
            series: [
                {
                    name: '总量',
                    type: 'line',
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
        if (params && params.seriesData) {
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
    lineChartOptions(params) {
        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: { color: '#5dbef6' },
                axisPointer: { lineStyle: { color: '#e7e7ee' } },
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            grid: {
                left: '0',
                right: '2%',
                bottom: '0',
                top: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
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
            },
            yAxis: [
                {
                    type: 'value',
                    splitLine: { lineStyle: { color: this.lineColor } },
                    axisTick: { show: false },
                    axisLine: { lineStyle: { color: this.lineColor } },
                    axisLabel: { textStyle: { color: this.labelColor } },
                    gridIndex: 0,
                    splitArea: { show: true, areaStyle: { color: this.areaColor } }
                }
            ],
            color: echartsConfig.itemColor,
            series: []
        };

        // 处理 series值
        if (params && params.seriesData) {
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
    MapEChartsOptions(params) {
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
    lineBarChartOptions(params) {
        let option = {
            // title: {
            //     text: '新增用户统计',
            //     textStyle: echartsConfig.darkThemeColor.titleStyle
            // },
            legend: {
                orient: 'horizontal', // 'vertical'
                x: 'right', // 'center' | 'left' | {number},
                y: '-5', // 'center' | 'bottom' | {number}
                textStyle: { color: '#14A0D3' },
                itemGap: 16,
                itemWidth: 15,
                itemHeight: 10,
                data: params && params.seriesData && params.seriesData instanceof Array ? params.seriesData.map(item => item.name) : []
            },
            grid: echartsConfig.darkThemeColor.grid,
            tooltip: echartsConfig.darkThemeColor.lineTooltip(),
            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: echartsConfig.darkThemeColor.lineStyle,
                    }
                },
                axisLabel: {
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
            }, {
                type: 'value',
                // name:'人',
                nameGap: 35,
                position: 'left',
                nameTextStyle: {
                    color: echartsConfig.darkThemeColor.axisLabel,
                    fontSize: 16,
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
                    symbol: 'circle',
                    symbolSize: 5,
                    data: []
                }, {
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
        if (params && params.seriesData) {
            for (let i = 0, optionSeries = params.seriesData; i < optionSeries.length; i++) {
                option.series[i] = Object.assign(option.series[i], optionSeries[i])
            }
        }
        return option;
    },
    lineBarLightChartOptions(params) {
        // var lineBarArr = [{ "month": 201709, "goodCallCnt": 6, "totalCallCnt": 1 },
        //     { "month": 201710, "goodCallCnt": 6, "totalCallCnt": 2 },
        //     { "month": 201711, "goodCallCnt": 6, "totalCallCnt": 3 },
        //     { "month": 201712, "goodCallCnt": 6, "totalCallCnt": 4 },
        //     { "month": 201801, "goodCallCnt": 8, "totalCallCnt": 5 },
        //     { "month": 201802, "goodCallCnt": 2, "totalCallCnt": 6 },
        //     { "month": 201803, "goodCallCnt": 3, "totalCallCnt": 2 },
        //     { "month": 201804, "goodCallCnt": 5, "totalCallCnt": 3 },
        //     { "month": 201805, "goodCallCnt": 4, "totalCallCnt": 3 },
        //     { "month": 201806, "goodCallCnt": 6, "totalCallCnt": 1 },
        //     { "month": 201807, "goodCallCnt": 6, "totalCallCnt": 8 },
        //     { "month": 201808, "goodCallCnt": 6, "totalCallCnt": 1 }];
        // 数据处理
        var type = [
            { name: '访问总量', type: 'bar',  key: 'totalCallCnt', itemStyle: { color: '#2D83F8' } },
            { name: '有效匹配量', type: 'bar',  key: 'goodCallCnt', itemStyle: { color: '#2AB84C' } },
            { name: '匹配率', type: 'line', itemStyle: { color: '#FFBA00' } },
        ];
        
        let result = {
            seriesData: [],
            legendData: [],
            xAxisData: []
        };
        if(params && params.length){
            let lineBarArr = params;
            // 数据
            let seriesArr = [];
            type.forEach((e, i) => {
                let data = [];
                let other = null;
                if(e.key){
                    data = lineBarArr.map(v => { return v[e.key] })
                    seriesArr.push({ name: e.name, type: e.type, data, barWidth: '24%', itemStyle: e.itemStyle})
                }else{
                    data = lineBarArr.map((v) => {
                        return (v.goodCallCnt == 0 || v.totalCallCnt == 0) ? 0 : v.totalCallCnt(v.goodCallCnt/v.totalCallCnt).toFixed(2) * 100;
                    })
                    seriesArr.push({ name: e.name, type: e.type, data, yAxisIndex: 1, itemStyle: e.itemStyle})
                }
            })
            
            result.seriesData = seriesArr;
            // x轴
            result.xAxisData = lineBarArr.map((v) => {
                const x = v.month.toString();
                return `${x.substr(0,4)}-${x.substr(4,2)}`
            })
            // legend
            result.legendData = type.map((v) => {
                return v.name
            })
        }

        let option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: { color: '#666' },
                axisPointer: { type: 'shadow' },
                formatter:'{a0}：{c0} <br/>{a1}：{c1} <br/>{a2}：{c2}%',
                extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
            },
            grid: { left: '0', right: '0', bottom: '0', top: '38', containLabel: true },
            legend: {
                name: result.seriesData.map(v => v.name),
                textStyle: { color: this.labelColor },
            },
            xAxis: {
                type: 'category',
                axisTick:  { show: false },
                axisLine:  { lineStyle: { color: this.lineColor } },
                splitLine: { show: true, lineStyle: { color: this.lineColor } },
                data: result.xAxisData,
                axisLabel: { textStyle: { color: this.labelColor } },
            },
            yAxis: [{
                type: 'value',
                splitLine: { lineStyle: { color: this.lineColor } },
                splitArea: { show: true, areaStyle: { color: this.areaColor } },
                axisLine:  { lineStyle: { color: this.lineColor } },
                axisTick:  { show: false },
                axisLabel: { textStyle: { color: this.labelColor } }
            }, {
                type: 'value',
                position: 'right',
                axisLabel: { textStyle: { color: this.labelColor }, formatter:'{value}%' },
                splitLine: { show: false },
                axisLine:  { lineStyle: { color: this.lineColor } },
                axisTick:  { show: false },
            }],
            series: result.seriesData
        };

        return option;
    },
    lineSingleBarLightChartOptions(params){
        let result = {
            seriesData: [],
            legendData: [],
            xAxisData: []
        };

        if(params && params.data){
            let lineBarArr = params.data;
            // 数据
            let seriesArr = [];
            let data = [];
            if(params.type){ 
                data = lineBarArr.map(v => { return v['yAxis'] });  //todo
                seriesArr.push({ name: params.name, type: 'bar', data, barWidth: '24%', itemStyle:{normal:{ color:'#108EFF'}}})
                result.seriesData = seriesArr;
                // x轴
                result.xAxisData = lineBarArr.map((v) => {
                    // const x = v.month.toString();
                    // return `${x.substr(0,4)}-${x.substr(4,2)}`
                    return v.xAxis;
                })
                // legend
                result.legendData = params.legend;
            }
        }
        let option = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    textStyle: { color: '#666' },
                    axisPointer: { type: 'shadow' },
                    formatter:'{a0}：{c0}',
                    extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                },
                grid: { left: '0', right: '0', bottom: '0', top: '10', width:'100%',containLabel: true },
                // legend:{
                //     name: result.legendData,
                //     textStyle: { color: this.labelColor },
                // },
                xAxis: {
                    type: 'category',
                    axisTick:  { show: false },
                    axisLine:  { lineStyle: { color: this.lineColor } },
                    splitLine: { show: false, lineStyle: { color: this.lineColor } },
                    data: result.xAxisData,
                    axisLabel: { textStyle: { color: this.labelColor } },
                },
                yAxis: [{
                    type: 'value',
                    splitLine: {  show: true,lineStyle: { color: '#f0f0f0', borderType:"dotted" } },
                    splitArea: { show: true, areaStyle: { color: this.areaColor } },
                    axisLine:  { lineStyle: { color: this.lineColor } },
                    axisTick:  { show: false },
                    axisLabel: { textStyle: { color: this.labelColor } }
                }],
                series: result.seriesData
            };
        return option;
    },
    circlePieLightChartOptions(params){
        let result = {
            seriesData: [],
            legendData: [],
        };
        if(params && params.length){
            result.legendData = params.map(item => {
                return {
                    name:item.name,
                }
            });
            result.seriesData = params;
        }
        let option = {
                grid: { left: '10', right: '10%', bottom: '0', top: '38', containLabel: true },
                // color: ['#41cb73', '#fad336', '#f2637b', '#975fe4','#3a9ff', '#36cbca', '#41cb73', '#c23531','#2f4554','#d48265'],
                legend: {
                    orient: 'vertical',
                    right: '20%',
                    y: '40',
                    icon: 'circle',
                    itemGap:20,
                    data:result.legendData,
                    formatter: function (name) {
                        var total = 0;
                        var target;
                        for (var i = 0, l = params.length; i < l; i++) {
                        total += params[i].value;
                        if (params[i].name == name) {
                            target = params[i].value;
                            }
                        }
                        return name + '  ' + target + '  ' + ((target/total)*100).toFixed(2) + '%';
                    }
                },
                series: [
                    {
                        type:'pie',
                        radius: ['40%', '55%'],
                        center: ['35%', '50%'],
                        label: {
                            normal: {
                                formatter: '{b|{b}：}{c}  {per|{d}%}',
                                rich: {
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#108EFF',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                },
                                // textStyle: { color: '#333' }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        data:result.seriesData
                    }
                ]
            };
        return option;
    },
    darkLineAreaChartOptions(params) {
        let option = {
            // title: {
            //     text: params && params.title ? params.title : '本月访问人数统计',
            //     textStyle: echartsConfig.darkThemeColor.titleStyle
            // },
            legend: {
                orient: 'horizontal', // 'vertical'
                x: 'right', // 'center' | 'left' | {number},
                y: '-5', // 'center' | 'bottom' | {number}
                itemGap: 16,
                itemWidth: 15,
                itemHeight: 10,
                textStyle: { color: '#14A0D3', fontSize: 12 },
                data: params && params.seriesData && params.seriesData instanceof Array ? params.seriesData.map(item => item.name) : [],
            },
            tooltip: echartsConfig.darkThemeColor.lineTooltip('axis'),
            grid: echartsConfig.darkThemeColor.grid,
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: echartsConfig.darkThemeColor.lineStyle,
                        }
                    },
                    axisLabel: {
                        color: echartsConfig.darkThemeColor.axisLabel
                    },
                    data: params && params.xAxisData ? params.xAxisData : []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    nameTextStyle: { color: echartsConfig.darkThemeColor.axisLabel, fontSize: 16 },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLine: { lineStyle: { color: echartsConfig.darkThemeColor.lineStyle } },
                    axisLabel: { color: echartsConfig.darkThemeColor.axisLabel }
                }
            ],
            series: [
                {
                    name: '访问人数',
                    type: 'line',
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
                    symbol: 'circle',
                    symbolSize: 5,
                    smooth: true, //是否平滑处理值0-1,true相当于0.5
                    data: []
                }
            ]
        };
        // 新方法处理 series的值(处理指定个数用)
        if (params && params.seriesData) {
            for (let i = 0, optionSeries = params.seriesData; i < optionSeries.length; i++) {
                option.series[i] = Object.assign(option.series[i], optionSeries[i])
            }
        }
        return option;
    },
    darkPieChartOptions(params) {
        let option = {
            tooltip: echartsConfig.darkThemeColor.lineTooltip(),
            color: ['#3ab4ff', '#1b88c2', '#ff8421'],
            series: [{
                type: 'pie',
                name: '',
                radius: ['0%', '96%'],
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
                type: 'pie',
                radius: ['35%', '70%'],
                center: ['50%', '50%'],
                data: params ? params : [{ value: 30, name: '未上线' }, { value: 80, name: '正常服务' }, { value: 10, name: '异常服务' }].sort(function (a, b) { return b.value - a.value }),
                roseType: 'angle',
                hoverAnimation: false
            }]
        };
        return option;
    },
    darkScatterOptions(params) {
        // 数据处理，从大到小
        let plantCap = params ? params : [
            { name: '北京', value: 315 },
            { name: '上海', value: 222 },
            { name: '广州', value: 113 },
            { name: '深圳', value: 95 },
            { name: '武汉', value: 92 },
            { name: '仙桃', value: 87 },
            { name: '大理', value: 60 },
            { name: '成都', value: 55 },
            { name: '青岛', value: 52 },
            { name: '南京', value: 47 },
            { name: '江苏', value: 40 }
        ].sort(function (a, b) { return b.value - a.value })

        // 预设点位
        let datalist = [
            { offset: [62, 46], symbolSize: 70 },
            { offset: [34, 45], symbolSize: 62 },
            { offset: [82, 82], symbolSize: 54 },
            { offset: [46, 20], symbolSize: 48 },
            { offset: [52, 80], symbolSize: 42 },
            { offset: [77, 20], symbolSize: 38 },
            { offset: [90, 30], symbolSize: 36 },
            { offset: [18, 26], symbolSize: 34 },
            { offset: [5, 56], symbolSize: 30 },
            { offset: [-6, 26], symbolSize: 26 },
            { offset: [105, 60], symbolSize: 26 }
        ]

        // 合并
        for (let i = 0; i < plantCap.length; i++) {
            const e = plantCap[i];
            datalist[i].offset.push(e.value)
        }

        let datas = [];
        for (let i = 0; i < plantCap.length; i++) {
            let item = plantCap[i];
            let itemToStyle = datalist[i];

            datas.push({
                name: item.name,
                value: itemToStyle.offset,
                symbolSize: 38, // TODO，大小
                label: { normal: { textStyle: { fontSize: 12 } } },
                itemStyle: { normal: { color: 'rgba(20, 176, 233, .4)' } }
            })
        }

        let option = {
            // title: {
            //     text: '用户所在地区分布情况',
            //     textStyle: echartsConfig.darkThemeColor.titleStyle
            // },
            tooltip: echartsConfig.darkThemeColor.lineTooltip(),
            grid: { show: false, top: 10, bottom: 10 },
            xAxis: [{ gridIndex: 0, type: 'value', show: false, min: 0, max: 100, nameLocation: 'middle', nameGap: 5 }],
            yAxis: [{ gridIndex: 0, min: 0, show: false, max: 100, nameLocation: 'middle', nameGap: 30 }],
            series: [{
                type: 'scatter', symbol: 'circle', symbolSize: 120,
                label: {
                    normal: { show: true, formatter: '{b}', color: '#A7E8FF', textStyle: { fontSize: '12' } },
                },
                itemStyle: { normal: { color: '#00acea' } },
                data: datas
            }]
        }
        option.tooltip.formatter = function (obj) {
            let info = obj.data;
            return info.name + '：' + info.value[2] + '人'
        }
        return option;
    },
    darkVerticalBarChartOptions(params) {
        let seriesName = [],
            seriesData = [],
            length = 5;
        // 处理数据
        // params = [
        //     {name: 'a', value: 1},
        //     {name: 'a', value: 1},
        //     {name: 'a', value: 1}
        // ]
        // TODO: You may have an infinite update loop in watcher with expression "option"
        // https://github.com/vuejs/vue/issues/1153
        if (params && params instanceof Array && params.length) {
            seriesData = params.slice().sort((a, b) => a.value - b.value) // 从小到大
            console.log(seriesData.length, 648)
            let seriesDataLength = seriesData.length;
            if (seriesDataLength < length) {
                let l = length - seriesDataLength;
                for (let i = 0; i < l; i++) {
                    seriesData.unshift({ name: '', value: '' })
                }
            }
            seriesName = seriesData.map(item => item.name)
        }

        let option = {
            grid: { left: '0', top: '6%', right: '5%', bottom: '0', containLabel: true },
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
                data: seriesName,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: true, color: echartsConfig.darkThemeColor.axisLabel },
                splitLine: { show: false }
            }],
            series: [{
                name: '',
                type: 'bar',
                barWidth: 12,
                silent: false,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            color: echartsConfig.darkThemeColor.axisLabel
                        }
                    }
                },
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
                data: seriesData
            }]
        };
        return option;
    },
    verticalBarChartOptions(params){
        let seriesName = [],
        seriesData = [],
        length = 5;
    if (params && params instanceof Array && params.length) {
        seriesData = params.slice().sort((a, b) => a.value - b.value) // 从小到大
        console.log(seriesData.length, 648)
        let seriesDataLength = seriesData.length;
        if (seriesDataLength < length) {
            let l = length - seriesDataLength;
            for (let i = 0; i < l; i++) {
                seriesData.unshift({ name: '', value: '' })
            }
        }
        seriesName = seriesData.map(item => item.name)
    }

    let option = {
        grid: { left: '0', top: '0', right: '5%', bottom: '0', width:'90%', containLabel: true },
        tooltip: {show: true},
        xAxis: {
            type: 'value',
            show: true,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false },
        },
        yAxis: [{
            type: 'category',
            data: seriesName,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { 
                show: true,
                textStyle: {
                    fontSize:14,
                    color: '#666',
                    textAlign:'left' 
                }
            },
            splitLine: { show: false }
        }],
        series: [{
            name: '',
            type: 'bar',
            barWidth: 12,
            // barMaxHeight:90,
            barMinHeight:10,
            silent: false,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        fontSize:14,
                        color: '#666',
                    },
                    formatter(v) {
                        let text = v.data.value.toString();
                        return text.length < 10 
                            ? text 
                            : `${text.substr(0,6)}`+'...'
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 0,
                    color: {
                        type: 'bar',
                        colorStops: [
                            { offset: 1, color: '#108EFF' },
                        ],
                        globalCoord: false, // 缺省为 false
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: seriesData
        }]
    };
    return option;
    }
}

export default echartsConfig;