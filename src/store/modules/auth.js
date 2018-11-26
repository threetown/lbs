import * as types from '../mutation-types'
import { otherRouter } from 'src/router/router';
import router from 'src/router'

// state
const state = {
    MenuList: [],
    routers: [
        otherRouter
    ],
    userData: {},
    nickname: '--',
    message: 0
}

// actions
const actions = {
    recordUserInfo({ commit }, res) {
        commit(types.RECORD_USERINFO, res)
    },
    userLogout({ commit }) {
        commit(types.LOGOUT)
    }
}

// getters
const getters = {

}

// mutations
const mutations = {
    [types.AUTH_APP_ROUTER](state, res) {
        state.routers.push(...res);
        router.addRoutes(res);
    },
    [types.AUTH_DEFAULT_ROUTER](state, res) {
        router.addRoutes(res);
    },
    [types.AUTH_MENU_LIST](state, res) {
        state.MenuList = res
    },
    [types.RECORD_USERINFO](state, res) {
        localStorage.setItem('userData', JSON.stringify(res))
        state.userData = res
    },
    [types.LOGOUT]() {
        localStorage.removeItem('userData')
        state.userData = {}
    },
    [types.AUTH_USER_NICKNAME](state, res) {
        state.nickname = res
    },
    [types.AUTH_USER_MESSAGE](state, res) {
        state.message = res
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}