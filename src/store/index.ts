import { createStore } from 'vuex'

export default createStore({
  state: {
    finger: {
      index: -1,
      role: null
    },
    pusherId: ''
  },
  mutations: {
    setFinger (state, data) {
      state.finger = data
    },
    setPusherId (state, data) {
      state.pusherId = data
    }
  },
  actions: {
    setFinger ({ commit }, data) {
      commit('setFinger', data)
    },
    setPusherId ({ commit }, data) {
      commit('setPusherId', data)
    }
  },
  modules: {
  }
})
