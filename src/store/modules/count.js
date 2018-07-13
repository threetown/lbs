import * as types from '../mutation-types'

// state
const state = {
  // 访问统计
  overviewAccess: [],
}

// actions
const actions = {
  /**
   * 记录
   */
  recordOverviewAccess({ commit }, res) {
    commit(types.RECORD_OVERVIEW_ACCESS, res)
  }

}

// getters
const getters = {
  overviewAccess: state => state.overviewAccess
}

// mutations
const mutations = {
  [types.RECORD_OVERVIEW_ACCESS](state, res) {
    state.overviewAccess = res
  }
}

export default {
    state,
    actions,
    getters,
    mutations
}