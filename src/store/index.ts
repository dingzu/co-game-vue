import { createStore } from 'vuex'

export default createStore({
  state: {
    finger: {
      index: -1,
      role: null
    }
  },
  mutations: {
    setFinger (state, data) {
      state.finger = data
    }
  },
  actions: {
    setFinger ({ commit }, data) {
      commit('setFinger', data)
    }
  },
  modules: {
  }
})
