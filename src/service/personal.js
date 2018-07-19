import fetch from 'src/util/fetch';
import * as basicConfig from 'src/config/basicConfig'

// 用户信息
export const ajaxPostUserinfo = () => fetch({ url: '/center/user/getUserInfo/', method: 'post' })

// 用户登出
export const ajaxPostLogout = () => fetch({ url: '/api/amp/client/logout', method: 'post' })

// 修改手机号
export const ajaxPostChangePhone = (data) => fetch({ url: '/center/user/changePhone', method: 'post', data})

// 修改邮箱
export const ajaxPostChangeMail = (data) => fetch( {url: '/center/user/changeEmail', method: 'post', data})

// 修改密码
export const ajaxPostChangePassword = (data) => fetch( {url: '/center/user/changePassword', method: 'post', data})

// 配额管理
export const ajaxPostQuotaType = (data) => fetch( {url: '/center/user/getAppAndKey', method: 'post', data})

// 配额管理 - table
export const ajaxPostQuotaList = (data) => fetch( {url: '/center/user/getRelStaffKey', method: 'post', data})

// 配额申请记录
export const ajaxPostQuotaRecord = (data) => fetch( {url: '/center/user/applyRelStaffKey', method: 'post', data})

// 提升配额
export const ajaxPostUpQuota = (data) => fetch({ url: '/center/logOperStaffService/insert', method: 'post', data })

// 发送短信验证码
export const ajaxPhoneSendSMSCode = (data) => fetch({
    headers: {
        'Content-type': 'application/x-www-form-urlencoded'
    },
    url: basicConfig.SSOUrl + '/sso/user/sendCode', 
    method: 'post',
    data
})
