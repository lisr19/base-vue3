import {defineStore} from 'pinia'
import {store} from '@/store'

export const useMessageStore =  defineStore('message',{
  state:()=>{
    return {
      // 告警事件列表
      alarmList: [] as any 
    }
  },
  getters:{

  },
  actions:{
    ADD_ALARM(msg:any){
      this.alarmList.unshift(msg)
      // 仅保存最新100条告警消息
      if (this.alarmList.length > 100) {
        this.alarmList = this.alarmList.splice(0, 100)
      }
    },
    REMOVE_ALARM(index:number){
      this.alarmList.splice(index, 1)
    },
    CLEAR_ALARM(){
      this.alarmList = []
    },
    // 添加告警事件
  addAlarm (msg:Recordable) {
    let { eventId, eventDomainName, description, date, isRead } = msg
    this.ADD_ALARM( { eventId, eventName: eventDomainName, description, date, isRead })
  },
  // 删除指定告警事件
  removeAlarm (id:string|number) {
    let matchIndex:number = this.alarmList.findIndex((item:Recordable) => {
      return item.eventId === id
    })
    if (matchIndex > -1) {
      this.REMOVE_ALARM(matchIndex)
    }
  },
  // 清空告警事件列表
  cleanAlarm () {
    this.CLEAR_ALARM()
  }
  }
})

// Need to be used outside the setup
export function useMessageWidthOut() {
  return useMessageStore(store);
}