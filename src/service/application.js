import fetch from 'src/util/fetch';

export const ajaxPostApp = (data) => fetch({ url: '/center/appKeyInfo/list', method: 'post', data })   // 应用列表
export const ajaxCreateApp = (data) => fetch({ url: '/center/appInfo/insert', method: 'post', data })  // 创建新应用
export const ajaxUpdateApp = (data) => fetch({ url: '/center/appInfo/update', method: 'post', data })  // 编辑应用

export const ajaxDeleteApp = (data) => fetch({ url: '/center/appInfo/delete', method: 'post', data })  // 删除回收站

export const ajaxServiceType = () => fetch({ url: '/center/serviceInfo/list', method: 'get' })    // 服务平台列表

export const ajaxAppType = (params) => fetch({ url: '/center/dict/list/'+params, method: 'get' })    // 应用类型列表

export const ajaxUpdateKey = (data) => fetch({ url: '/center/keyInfo/update', method: 'post', data })
export const ajaxCreateKey = (data) => fetch({ url: '/center/keyInfo/insert', method: 'post', data })
export const ajaxDeleteKey = (data) => fetch({ url: '/center/keyInfo/delete', method: 'post', data })
