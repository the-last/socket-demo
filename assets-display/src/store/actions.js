import * as types from './mutation-types'
import router from '@/router'

export const userLogin = ({ commit }, userId) => {
  if (userId) {
    // console.log(userId, 'store--userlogin')
    commit(types.USER_LOGIN, userId)
  } else {
    commit(types.USER_LOGOUT)
  }
  router.push('/')
}

export const userLogout = ({ commit }) => {
  commit(types.USER_LOGOUT)
  router.push('/')
}

export const userTyper = ({ commit }, userType) => {
  commit(types.USER_TYPE, userType)
}

export const beginRequest = ({commit}) => {
  commit(types.LOADING_REQUEST, true)
  setTimeout(function () {
    commit(types.LOADING_REQUEST, false)
  }, 7000)
}

export const endRequest = ({commit}) => {
  commit(types.LOADING_REQUEST, false)
}

export const setRangeProof = ({commit}, val) => {
  console.log('hha', val)
  commit(types.RANGEPROOF, val)
}
