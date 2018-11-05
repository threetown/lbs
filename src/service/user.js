import fetch from 'src/util/fetch';

// 用户管理 - 用户列表
export const ajaxPostUserList = (data) => fetch({ url: '/center/userAccount/getUserList', method: 'post', data })

// 用户管理 - 删除
export const ajaxPostDeleteUser = (params) => fetch({ url: '/center/deleteUser/' + params, method: 'post' })

// 用户管理 - 用户可用金额
export const ajaxPostBalance = (params) => fetch({ url: '/center/userAccount/' + params, method: 'post' })

// 帐户管理 - 扣款列表
export const ajaxPostDeductList = (data) => fetch({ url: '/center/userAccount/deductList', method: 'post', data })

// 用户管理 - 交易记录
export const ajaxPostDealRecord = (data) => fetch({ url: '/center/userAccount/dealRecord', method: 'post', data })

// 用户管理 - 充值
export const ajaxPostAccountTopUp = (data) => fetch({ url: '/center/userAccount/topUp', method: 'post', data })

// 用户管理 - 扣款明细
export const ajaxPostDeductMoney = (data) => fetch({ url: '/center/userAccount/deductMoney', method: 'post', data })

// 用户管理 - 扣款
export const ajaxPostCutPayment = (data) => fetch({ url: '/center/userAccount/cutPayment', method: 'post', data })

// 扣款 - 账单结算
export const ajaxPostEsData = (data) => fetch({ url: '/center/getEsDataToPg', method: 'post', data })
