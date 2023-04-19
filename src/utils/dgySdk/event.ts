let watcherList:any[] = []

// 注册监听器
const initWatcher = (watcher:any) => {
  watcherList.push(watcher)
}

// 派发事件
const dispatchWSEvent = (event:any) => {
  watcherList.forEach((v:any) => {
    v(event)
  })
}

const removeWatcher = (watcher:any) => {
  watcherList.splice(watcherList.indexOf(watcher), 1)
}

// 接收主工程推送消息
export default {
  initWatcher,
  dispatchWSEvent,
  removeWatcher
}
