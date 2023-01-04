import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginIndex: false,
    userInfo: {}
  },
  getters: {},
  mutations: {
    setLoginIndex(state, data) {
      state.loginIndex = data
    },
    setUserInfo(state, data) {
      state.userInfo = data
    },
    resetUser(state) {
      state.loginIndex = false
      state.userInfo = {}
    }
  },
  actions: {
    setLoginIndex({ commit }, data) {
      commit('setLoginIndex', data)
    },
    setUserInfo({ commit }, data) {
      commit('setUserInfo', data)
    },
    resetUser({ commit }) {
      commit('resetUser')
    }
  },
  modules: {}
})
