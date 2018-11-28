import fetch from 'src/util/fetch';

export const ajaxPostMsg = (data) => fetch({ url: '/center/user/findUserNoticeList', method: 'post', data })   // 消息列表
export const ajaxUpdateMsg = (data) => fetch({ url: '/center/user/updateNotice', method: 'post',data })   // 更新消息
export const ajaxDelMsg = (data) => fetch({ url: '/center/user/deleteNotice', method: 'post',data })   // 删除消息

