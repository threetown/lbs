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
    { label: '男', value: '1' },
    { label: '女', value: '2' },
    { label: '保密', value: '0' }
]

/* 生产地址 */
// let LbsUrl = 'http://lbs.cindata.cn';        // LBS
// let SSOUrl = 'http://sso.cindata.cn';        // SSO
// let APIUrl = 'http://consoleapi.cindata.cn'; // API请求地址
// let mapviewUrl = 'http://mapview.cindata.cn'  // 数据可视化

/* 测试地址 */
let LbsUrl = 'http://testlbs.cindata.net';        // LBS
let SSOUrl = 'http://testsso.cindata.net';        // SSO
let APIUrl = 'http://testconsoleapi.cindata.net'; // API请求地址
let mapviewUrl = 'http://testmapview.cindata.net/mapv/commondata'  // 数据可视化-我的数据

let url = {
    home: LbsUrl + '/gxdyun',
    logout: LbsUrl + '/amp/client/logout',
    jump: SSOUrl + '/sso/login?callbackUrl=' + LbsUrl + '&p=gxdyun'
}

let selectTimeDict = [
    // { label: '今天', value: 'today'},     // 按天统计今天的总数
    // { label: '昨天', value: 'yesterday'}, // 按天统计昨天的总数
    // { label: '昨天', value: 'yesterdayOfHours'}, // 按小时统计昨天的访问数
    // { label: '近三个月', value: 'threeMonthOfDays'},  // 按天统计最近三月
    // { label: '近半年', value: 'halfYearOfMonths'},  // 按月统计最近半年
    { label: '近30天', value: 'monthOfDays'},  // 按天统计最近一月
    { label: '近一周', value: 'weekOfDays'}, // 按天统计最近一周
    { label: '今天', value: 'todayOfHours'}, // 按小时统计今天的访问数
]

let serverType = [
    { label: '全部', value: 0 },
    { label: 'web服务', value: 1 },
    { label: '地图服务', value: 2 },
    { label: '楼盘字典', value: 3 }
]

export {
    PanelService,
    gender,
    url,
    selectTimeDict,
    serverType,
    APIUrl,
    SSOUrl,
    mapviewUrl
}