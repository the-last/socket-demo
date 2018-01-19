import Vue from 'vue'
import axios from 'axios'
import lodash from 'lodash'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import App from './App.vue'
import Toast from '@/components/widgets/Toast'
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.component('icon', Icon)
Vue.use(ElementUI)

const { dispatch } = store

let blockHistoryIp
let peerServerIp
let url = ''
let env = process.env.NODE_ENV.toString()
if (env === 'prod') {
  // 测试
  url = 'http://baas2-gw-stg.jryzt.com/sparrow1'
  blockHistoryIp = 'http://172.24.130.5:10088/blkexplorer/api/v1/'
  peerServerIp = '172.24.241.28:11051'
  // 生产
  // url = 'http://baas2-gw.jryzt.com/sparrow1'
} else {
  url = '/dev1'
  blockHistoryIp = 'http://172.24.241.21:10088/blkexplorer/api/v1/'
  peerServerIp = '172.24.241.28:11051'
}
Vue.prototype.$blockHistoryIp = blockHistoryIp
Vue.prototype.$peerServerIp = peerServerIp
var httpInstance = axios.create({
  baseURL: url,
  timeout: 5000,
  withCredentials: false
})

httpInstance.interceptors.request.use(conf => {
  return conf
})
httpInstance.interceptors.response.use(conf => {
  return conf
}, err => {
  if (err.response) {
    let errStatus = err.response.status
    console.log('interceptor阶段, 返回状态: ', errStatus)
    if (errStatus === 401) {
      this.$message.error({ message: '需要重新登录' })
      dispatch('userLogout')
      router.replace('/')
      return Promise.reject(err)
    } else if (errStatus === 403) {
      this.$message.error({ message: '禁止访问，没有权限' })
      return Promise.reject(err)
    } else if (errStatus >= 404 && errStatus < 423) {
      this.$message.error({ message: '网络故障' })
      return Promise.reject(err)
    } else if (errStatus === 423) {
      this.$message.error({ message: '已被锁定，30分钟后重试' })
      return Promise.reject(err)
    }
  }
})
Vue.prototype.$http = httpInstance
Vue.prototype.$toast = Toast
Vue.prototype.$lodash = lodash
Vue.prototype.$isEmptyObject = (obj) => {
  if (obj instanceof Array) {
    for (let i in obj) {
      return false
    }
    return true
  }
  if (typeof obj === 'object') {
    let jsonObj = JSON.stringify(obj)
    if (jsonObj.length > 2) {
      return false
    }
    return true
  }
}

sync(store, router)
// const { state, dispatch } = store

router.beforeEach(function (route, redirect, next) {
  // if (!state.user.isLogin && route.path !== '/login') {
  //   next('/login')
  //   return
  // }
  // if (state.user.isLogin && route.path === '/login') {
  //   next('/')
  //   return
  // }
  // 判断登录的时候使用
  // if (!state.user.isLogin && route.path !== '/Home') {
  if (route.path === '/' && route.path !== '/Home') {
    next('/Home')
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
    Icon
  }
})
