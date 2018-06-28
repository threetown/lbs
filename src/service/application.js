import fetch from 'src/util/fetch';

export const ajaxPostApp = (data) => fetch({ url: '/center/appKeyInfo/list', method: 'post', data })   // 应用列表
export const ajaxCreateApp = (data) => fetch({ url: '/center/appInfo/insert', method: 'post', data })  // 创建新应用
export const ajaxUpdateApp = (data) => fetch({ url: '/center/appInfo/update', method: 'post', data })  // 编辑应用

export const ajaxAppType = (params) => fetch({ url: '/center/dict/list/'+params, method: 'get' })    // 应用类型列表
