import request from '../api/request'
/**
 * 全局LOADING,message,messagebox
 */
import {
  ElMessage,
  ElMessageBox,
  ElLoading
} from 'element-plus'
// import './viewerjs/viewer'
// import { api as viewerApi } from './v-viewer/v-viewer.js'
import './viewerjs/viewer.css'
// let viewerShow = (urls) => {
//   viewerApi({
//     images: urls,
//     options: {
//       button: true,
//       navbar: true,
//       title: false,
//       toolbar: false,
//       tooltip: false,
//       rotatable: false,
//       scalable: false,
//       fullscreen: false,
//       keyboard: false
//     }
//   })
// }

var loadingInstance:any
var query:any[] = []
let queryCall = (id:string|number, isShow:boolean) => {
  if (isShow && !query.includes(id)) {
    query.push(id)
    if (!loadingInstance) {
      loadingInstance = ElLoading.service({
        background: 'rgba(0, 0, 0, 0.5)'
      })
    }
  }
  if (!isShow && query.includes(id)) {
    //   延迟300毫秒再去除，用于连续请求的时候，不会出现遮罩层闪烁的体验
    setTimeout(() => {
      let index = query.indexOf(id)
      query.splice(index, 1)
      if (!query.length && loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
      }
    }, 300)
  }
}

let messageBoxInstance:any = null
function showDialog (msg:string, type:any, callback:any) {
  if (!messageBoxInstance) {
    messageBoxInstance = ElMessageBox.alert(msg, '警告', {
      confirmButtonText: '确认',
      showClose: false,
      type
    }).then(() => {
      messageBoxInstance = null
      callback()
    })
  }
}

function confirm (msg:string, title:string, type:any, callback:any) {
  if (!messageBoxInstance) {
    messageBoxInstance = ElMessageBox.confirm(msg, title, {
      confirmButtonText: '确认',
      showClose: false,
      type
    }).then(() => {
      messageBoxInstance = null
      let cb = true
      callback(cb)
    }).catch(() => {
      messageBoxInstance = null
      let cb = false
      callback(cb)
    })
  }
}

let messageList:any[] = [] // 消息队列
function showMessage () {
  let event:any = messageList[0]
  if (event) {
    ElMessage({
      message: event.msg,
      type: event.showType,
      duration: (event.showType === 'success' ? 3 : 5) * 1000,
      onClose: () => {

      }
    })
  }
  setTimeout(() => {
    // console.log('end message', messageList)
    messageList.splice(0, 1)
    if (messageList.length) {
      showMessage()
    }
  }, 100)
}
const message = (msg:string, showType:string) => {
  let emptyList = !messageList.length
  messageList.push({
    msg, showType
  })
  // console.log('message', event, emptyList, messageList)
  if (emptyList) {
    showMessage()
  }
}

const methods = {
  request,
  // imagePerview: viewerShow,
  loading: queryCall,
  dialog: showDialog,
  confirm,
  message,
}

export default methods
