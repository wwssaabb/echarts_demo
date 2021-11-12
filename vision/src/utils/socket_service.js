/*
 * @Author: wwssaabb
 * @Date: 2021-06-15 10:46:42
 * @LastEditTime: 2021-11-12 17:10:09
 * @FilePath: \echarts_demo\vision\src\utils\socket_service.js
 */

export default class SocketService {
  /**
   * 单例设计模式
   */
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  //和服务器连接的WebSocket对象
  ws = null

  //服务器是否连接
  connected = false
  //记录重新发送请求的次数
  sendRetryCount = 0
  //记录重新连接服务器的次数
  connectRetryCount = 0

  //定义连接服务器的方法
  connect() {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://8.129.105.10:9998/')

    //连接成功的事件 onopen
    this.ws.onopen = () => {
      console.log('连接服务器成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    //连接关闭的事件 onclose
    this.ws.onclose = () => {
      console.log('连接服务器失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
        console.log(this.connectRetryCount)
      }, this.connectRetryCount * 500)
    }
    //接收到消息的事件 onmessage
    this.ws.onmessage = msg => {
      console.log('从服务器接收到数据')
      const msg_data = JSON.parse(msg.data)
      const socketType = msg_data.socketType
      if (this.callBackMapping[socketType]) {
        const action = msg_data.action
        if (action === 'getData') {
          const data = JSON.parse(msg_data.data)
          this.callBackMapping[socketType].call(this, data)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, msg_data)
        } else if (action === 'themeChange') {

        }
      }

    }
  }

  //存储回调函数
  callBackMapping = {}

  //注册回调函数
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  //取消注册的回调函数
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null
  }

  //发送数据
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else { //服务器未连接成功，延时发送
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 300)
    }
  }
}
