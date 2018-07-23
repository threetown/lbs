import * as types from '../mutation-types'

// state
const state = {
  // 访问统计
  overviewAccess: [],
  overviewService: [],
  AccessIP: {}, // 用户所在城市分成情况
  overviewUserLog: []
}

// actions
const actions = {
  /**
   * 记录
   */
  recordOverviewAccess({ commit }, res) {
    commit(types.RECORD_OVERVIEW_ACCESS, res)
  },
  recordOverviewService({ commit }, res) {
    commit(types.RECORD_OVERVIEW_SERVICE, res)
  },
  recordAccessIP({ commit }, res) { // 用户所在地区分布
    commit(types.RECORD_ACCESS_IP, res)
  },
  recordUserLog({ commit }, res) { // 用户动态
    commit(types.RECORD_USER_LOG, res)
  }

}

// getters
const getters = {
  overviewAccess: state => state.overviewAccess,
  overviewService: state => state.overviewService,
  accessIPProvince: state => state.AccessIP.provinceList,
  accessIPCity: state => state.AccessIP.cityList,
  overviewUserLog: state => state.overviewUserLog
}

// mutations
const mutations = {
  [types.RECORD_OVERVIEW_ACCESS](state, res) {
    state.overviewAccess = res
  },
  [types.RECORD_OVERVIEW_SERVICE](state, res) {
    state.overviewService = res
  },
  [types.RECORD_ACCESS_IP](state, res){
    state.AccessIP = res;
  },
  [types.RECORD_USER_LOG](state, res){
    state.overviewUserLog = res;
  }
}

export default {
    state,
    actions,
    getters,
    mutations
}