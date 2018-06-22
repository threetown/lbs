let PanelService = [
    {
        name: 'Web服务',
        type: 'web',
        children: [
            { name: "地理编码API", url: "" },
            { name: "逆地理编码API", url: "" },
            { name: "搜索API", url: "" },
            { name: "输入提示API", url: "" },
            { name: "路径规划API", url: "" },
            { name: "坐标转换API", url: "" },
            { name: "批量请求API", url: "" },
            { name: "地理围栏API", url: "" },
            { name: "行政区划查询API", url: "" },
            { name: "街道查询API", url: "" },
            { name: "小区查询API", url: "" },
            { name: "楼栋查询API", url: "" },
            { name: "单元查询API", url: "" }
        ]
    }, {
        name: '地图服务',
        type: 'map',
        children: [
            { name: "地图服务API", url: "" },
            { name: "地图服务API", url: "" },
            { name: "搜索API", url: "" },
            { name: "输入提示API", url: "" },
            { name: "路径规划API", url: "" },
            { name: "坐标转换API", url: "" },
            { name: "批量请求API", url: "" },
            { name: "地理围栏API", url: "" },
            { name: "行政区划查询API", url: "" },
            { name: "街道查询API", url: "" },
            { name: "小区查询API", url: "" },
            { name: "楼栋查询API", url: "" },
            { name: "单元查询API", url: "" }
        ]
    }
]

let gender = [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
    { label: '保密', value: 0 }
]

export {
    PanelService,
    gender
}