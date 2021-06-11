/*
 * @Author: wwssaabb
 * @Date: 2021-06-10 10:34:03
 * @LastEditTime: 2021-06-11 14:25:27
 * @FilePath: \demo\echarts_demo\vision\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import SellerPage from '@/views/sellerPage'
import TrendPage from '@/views/trendPage'
import MapPage from '@/views/mapPage'

Vue.use(VueRouter)

const routes = [
  {
    'path': '/sellerPage',
    'component': SellerPage
  },
  {
    'path': '/trendPage',
    'component': TrendPage
  },
  {
    'path': '/mapPage',
    'component': MapPage
  },
]

const router = new VueRouter({
  routes
})

export default router
