/*
 * @Author: wwssaabb
 * @Date: 2021-06-10 10:34:03
 * @LastEditTime: 2021-06-10 11:40:12
 * @FilePath: \demo\echarts_demo\vision\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import SellerPage from '@/views/sellerPage'

Vue.use(VueRouter)

const routes = [{
  'path': '/sellerPage',
  'component': SellerPage
}]

const router = new VueRouter({
  routes
})

export default router
