import fetch from 'src/util/fetch';

// 数据总览 - 异常统计
export const ajaxGetServiceOverview = () => fetch({ url: '/center/getServiceOverview', method: 'get' })

// 数据总览 - 访问统计
export const ajaxGetAccessOverview = () => fetch({ url: '/center/getAccessOverview', method: 'get' })

// 数据总览 - 业务分析
export const ajaxGetServiceLogCount = (params) => fetch({ url: '/center/getServiceLogCount/' + params, method: 'get' })

// 数据总览 - 流量分析
export const ajaxGetAccessLogCount = (params) => fetch({ url: '/center/getAccessCount/' + params, method: 'get' })

// 数据总览 - 用户分析
export const ajaxGetUserLogCount = (params) => fetch({ url: '/center/getUserLogCount/' + params, method: 'get' })

// 数据总览 - 用户动态
export const ajaxGetCallLog = () => fetch({ url: '/center/getCallLog', method: 'get' })

// 大屏展示 - 地图数据
export const ajaxGetCityInfo = () => fetch({ url: '/center/groupStaffCityInfo', method: 'get' })

// 大屏展示 - 服务分析
export const ajaxGetServerInfo = () => fetch({ url: '/center/getServerCountInfo', method: 'get' })

// 大屏展示 - 服务使用排名
export const ajaxGetServerRank = (params) => fetch({ url: '/center/getServieRanking/' + params, method: 'get' })
