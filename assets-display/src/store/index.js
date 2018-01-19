import Vue from 'vue'
import Vuex from 'vuex'
import Promise from 'es6-promise'
import * as actions from './actions'
import * as getters from './getters'
import modules from './modules'
import persistPlugin from './persist-plugin'

Promise.polyfill()
Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'prod',
  actions,
  getters,
  modules,
  plugins: [persistPlugin()]
})
