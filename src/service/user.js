import fetch from 'src/util/fetch';

// 用户管理 - 用户列表
export const ajaxPostUserList = (data) => fetch({ url: '/center/userAccount/getUserList', method: 'post', data })
