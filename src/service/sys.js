import fetch from 'src/util/fetch';

// 数据总览 - 异常统计
export const ajaxGetServiceOverview = () => fetch({ url: '/center/getServiceOverview', method: 'get' })

// 数据总览 - 访问统计
// export const ajaxGetAccessOverview = () => fetch({ url: '/center/getAccessOverview', method: 'get' })  //旧API
export const ajaxGetAccessOverview = () => fetch({ url: '/center/menudata/getAccessOverview', method: 'get' })   //新API

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

// 数据总览 - 当前用户总数
export const ajaxCurrentUserCount = () => fetch({ url: '/center/getUserCountByStatus', method: 'get'})

//数据总览  -服务调用Top5
export const ajaxGetServiceTopList = () => fetch({ url: '/center/menudata/getServiceTopList', method: 'get'})

//数据总览  -活跃用户Top5
export const ajaxGetUserTopList = () => fetch({ url: '/center/menudata/getUserTopList', method: 'get'})

//异常服务
export const ajaxGetServiceAbnormalList = () => fetch({ url: '/center/menudata/getServiceAbnormalList', method: 'get'})

//异常用户
export const ajaxGetUserAbnormalList = () => fetch({ url: '/center/menudata/getUserAbnormalList', method: 'get'})

//配额不足预警
export const ajaxGetInsufficientQuotaList = () => fetch({ url: '/center/menudata/getInsufficientQuotaList', method: 'get'})

//用户账户余额不足预警
export const ajaxGetInsufficientFundsList = () => fetch({ url: '/center/menudata/getInsufficientFundsList', method: 'get'})

// 数据总览new - 用户动态
export const ajaxGetUserCallLog = () => fetch({ url: '/center/menudata/getUserCallLog', method: 'get' })




/**
 * 系统管理 - 服务管理
 */
// 地图服务 - 列表
export const ajaxServerList = (data) => fetch({ url: '/center/map/getRegistMapList', method: 'post', data})
// 删除服务
export const ajaxDeleteServer = (params) => fetch({ url: '/center/map/deleteMapRegist/' + params, method: 'get'})
// 编辑服务
export const ajaxEditServer = (data) => fetch({ url: '/center/map/editMapRegist', method: 'post', data})

// 地图服务 - 新增列表查询
export const ajaxMapServerItems = (data) => fetch({ url: '/center/map/addMapRegistBefore', method: 'post', data})

// 地图服务 - 提交
export const ajaxMapServerRegist = (data) => fetch({ url: '/center/map/addMapRegist', method: 'post', data})

// 统计服务
export const ajaxRequestCount = (data) => fetch({ url: '/center/getApiRequestCountInfo', method: 'post', data})

// 服务调用详情
export const ajaxRequestServiceCallDetail = (data) => fetch({ url: '/center/getServiceCallDetail', method: 'post', data})

// 服务调用详情
export const ajaxRequestServiceDetailByDate = (data) => fetch({ url: '/center/getServiceDetailByDate', method: 'post', data})
