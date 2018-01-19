import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login'
import Index from '../views/Index'
import HistoryRecords from '../views/query/HistoryRecords'
import AssetsList from '../views/query/AssetsList'
import AssetsRelease from '../views/supervision/AssetsRelease'
import AssetsAlot from '../views/supervision/AssetsAlot'
import TransferInter from '../views/transfer/TransferInter'
import TransferOwn from '../views/transfer/TransferOwn'
import Home from '../views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/Home',
          // name: '666',
          component: Home
        },
        {
          path: '/AssetsList',
          component: AssetsList
        },
        {
          path: '/HistoryRecords',
          component: HistoryRecords
        },
        {
          path: '/AssetsRelease',
          component: AssetsRelease
        },
        {
          path: '/AssetsAlot',
          component: AssetsAlot
        },
        {
          path: '/TransferInter',
          component: TransferInter
        },
        {
          path: '/TransferOwn',
          component: TransferOwn
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
