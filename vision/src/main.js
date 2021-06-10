/*
 * @Author: wwssaabb
 * @Date: 2021-06-10 10:34:03
 * @LastEditTime: 2021-06-10 14:41:24
 * @FilePath: \demo\echarts_demo\vision\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

//引入全局样式文件
import './assets/css/global.scss'

Vue.config.productionTip = false

//将echarts对象挂载到vue原型上
Vue.prototype.$echarts=window.echarts

//设置网络请求基准路径
axios.defaults.baseURL='http://127.0.0.1:8888/api'
//将axios挂载到vue原型上
Vue.prototype.$http=axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
