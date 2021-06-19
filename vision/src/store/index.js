/*
 * @Author: wwssaabb
 * @Date: 2021-06-10 10:34:03
 * @LastEditTime: 2021-06-19 16:52:57
 * @FilePath: \demo\echarts_demo\vision\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme:'chalk'
  },
  mutations: {
    changeTheme(state){
      state.theme=state.theme==='chalk'?'vintage':'chalk'
    }
  },
  actions: {
  },
  modules: {
  }
})
