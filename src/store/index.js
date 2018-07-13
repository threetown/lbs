import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import count from './modules/count'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    count
  }
})