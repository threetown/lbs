import * as types from '../mutation-types'
import { otherRouter } from 'src/router/router';
import router from 'src/router'

// state
const state = {
    MenuList: [],
    routers: [
        otherRouter
    ],
    nickname: '--',
    message: 0
}

// actions
const actions = {

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