/*
 * @Author: wwssaabb
 * @Date: 2021-06-10 10:34:03
 * @LastEditTime: 2021-06-15 14:47:57
 * @FilePath: \demo\echarts_demo\vision\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import SellerPage from '@/views/sellerPage'
import TrendPage from '@/views/trendPage'
import MapPage from '@/views/mapPage'
import RankPage from '@/views/rankPage'
import HotPage from '@/views/hotPage'
import StockPage from '@/views/stockPage'
import ScreenPage from '@/views/screenPage'

Vue.use(VueRouter)

const routes = [
  {
    'path': '/',
    'component': ScreenPage
  },
  {
    'path': '/screenPage',
    'component': ScreenPage
  },
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
  {
    'path': '/rankPage',
    'component': RankPage
  },
  {
    'path': '/hotPage',
    'component': HotPage
  },
  {
    'path': '/stockPage',
    'component': StockPage
  },
]

const router = new VueRouter({
  routes
})

export default router
