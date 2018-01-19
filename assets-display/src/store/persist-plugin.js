import * as types from './mutation-types'
let storageKey = 'baas-manage-ls-key'
let storage = {
  get () {
    return JSON.parse(localStorage.getItem(storageKey) || '{}')
  },
  set (state) {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }
}

export default function createPersist () {
  return store => {
    store.replaceState(Object.assign({}, store.state, storage.get()))

    store.subscribe((mutation, state) => {
      if (mutation.type === types.USER_LOGOUT ||
          mutation.type === types.USER_LOGIN ||
          mutation.type === types.RANGEPROOF ||
          mutation.type === types.USER_TYPE) {
        let d = store.state
        storage.set(d)
      }
    })
  }
}
