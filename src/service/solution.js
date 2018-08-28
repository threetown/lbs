import fetch from 'src/util/fetch';

// 解决方案 - 用户列表
export const ajaxUserList = (data) => fetch({ url: '/center/user/list', method: 'post', data })

// 解决方案 - 创建应用
export const ajaxInserApp = (data) => fetch({ url: '/center/solution/insertApp', method: 'post', data })
