import * as types from '../mutation-types'

const state = {
  userId: null,
  isLogin: false,
  loading: false,
  userType: '机构-1',
  rangeProofState: false
}

const mutations = {
  [types.USER_LOGIN] (state, userId) {
    state.isLogin = true
    console.log(userId, 'mutations insolve')
    state.userId = userId
  },
  [types.USER_LOGOUT] (state) {
    state.isLogin = false
    state.userId = null
  },
  [types.LOADING_REQUEST] (state, loading) {
    state.loading = loading
  },
  [types.USER_TYPE] (state, userType) {
    state.userType = userType
  },
  [types.RANGEPROOF] (state, val) {
    state.rangeProofState = val
  }
}

export default {
  state,
  mutations
}
