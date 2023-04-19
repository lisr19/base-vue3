import ReconnectingWebSocket from './reconnecting-websocket.min.js'
import {store} from '@/store/index'
import SDK from '@/utils/dgySdk/index.js'
//message的pinia
import {useMessageWidthOut} from '@/store/modules/message'
const messageStore = useMessageWidthOut();
//wsEvent的pinia
import {useWsEventWidthOut} from '@/store/modules/wsEvent'
const useWsEventStore = useWsEventWidthOut();
//user的pinia
import {useUserStoreWidthOut} from '@/store/modules/user'
const userStore = useUserStoreWidthOut();


const VUE_APP_BASE_API = import.meta.env.VUE_APP_BASE_API || ''

// 接收来自其他页面的消息
// 改变自己的localstorage并不会触发事件
// 当前多个页面共用一个ws，后面新开的页面会抢占旧页面的ws资源
window.addEventListener('storage', function (event) {
  // 仅接受alarmMsg类型的storage事件
  if (event.key === 'alarmMsg' && event.newValue !== null) {
    try {
      var newData = JSON.parse(event.newValue)
      messageStore.addAlarm(newData)
    } catch (e) {
      console.log(e)
    }
  }
})

/**
 * 初始化websocket
 */
export function initWebsocket () {
  let protocol = window.location.protocol.indexOf('https') > -1 ? 'wss' : 'ws'
  // let protocol = 'wss'
  if (process.env.NODE_ENV === 'development') {
    protocol = 'wss'
  }
  let host = process.env.NODE_ENV === 'production' ? window.location.host : process.env.VUE_APP_BASE_WS
  // let host = process.env.VUE_APP_BASE_WS || window.location.host
  // 临时测试地址
  // let host = '192.168.1.79:29218'
  let url = `${protocol}://${host}/island-streaming/websocket/${userStore.userInfo.id}`
  var ws = new ReconnectingWebSocket(url, null, { reconnectInterval: 3000 })

  let timer: string | number | NodeJS.Timer | undefined
  let timer2: string | number | NodeJS.Timer | undefined
  ws.onopen = function () {
    console.log('WEBSOCKET启动')
    // 每分钟发送心跳包
    timer = setInterval(() => {
      ws.send('Keep-alive')
    }, 60000)
  }
  ws.onclose = function () {
    console.log('WEBSOCKET关闭')
    clearInterval(timer)
  }

  // 接收错误信号
  ws.onerror = function (e:any) {
    console.log('ws error', e)
  }

  // 接收websocket信号
  ws.onmessage = function (msg:Recordable) {
    // console.log('ws msg', msg)
    // alert(JSON.stringify(msg))
    try {
      let data = JSON.parse(msg.data)
      // console.log('WS推送数据', data)
      if (data instanceof Object) {
        // store.dispatch('message/addAlarm', data)
        useWsEventStore.SET_EVENT(data)
        SDK.event.dispatchWSEvent(data)
      }
    } catch (e) {
      // console.error(msg.data)
    }
  }

  let url2 = `${protocol}://${host}/island-streaming-server/websocket/${userStore.userInfo.id}`
  var ws2 = new ReconnectingWebSocket(url2, null, { reconnectInterval: 3000 })

  ws2.onopen = function () {
    console.log('WEBSOCKET2启动')
    // 每分钟发送心跳包
    timer2 = setInterval(() => {
      ws2.send('Keep-alive')
    }, 60000)
  }
  ws2.onclose = function () {
    console.log('WEBSOCKET2关闭')
    clearInterval(timer2)
  }

  // 接收错误信号
  ws2.onerror = function (e:any) {
    console.log('WEBSOCKET2错误', e)
  }

  // 接收websocket信号
  ws2.onmessage = function (msg:Recordable) {
    // console.log('ws2 msg', msg)
    // alert(JSON.stringify(msg))
    try {
      let data = JSON.parse(msg.data)
      // console.log('ws2 data', data)
      // if (data instanceof Object) {
      // store.dispatch('message/addAlarm', data)
      useWsEventStore.SET_EVENT(data)

      // console.log('事件派发', data)
      SDK.event.dispatchWSEvent(data)
    } catch (e) {
      // console.log(e, msg)
    }
  }
}

/**
 * 初始化postMessage消息接收
 */
export function initMessageReceiver () {
  window.addEventListener('message', function (event) {
    const VUE_APP_POSTMSG_WHITE_LIST = import.meta.env.VUE_APP_POSTMSG_WHITE_LIST || ''

    // 发起消息的页面在白名单中，或者父子页面同域名 则处理
    if (VUE_APP_POSTMSG_WHITE_LIST.indexOf(event.origin) > 0 || event.origin.search(window.location.hostname) > -1) {
      if (event.data === 'logout') {
        document.location.href = document.location.origin + VUE_APP_BASE_API + '/tenant_logout'
      }
    }
  }, false)
}
