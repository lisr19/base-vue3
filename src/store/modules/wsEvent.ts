import {defineStore} from 'pinia'
import {store} from '@/store'

export const useWsEventStore = defineStore('wsEvent', {
  // 其它配置项
	state:()=>{
		return {
			alarm: null,
      test: null,
      NewsCenterUnReadNum: null,
      NewsCenterValue: null,
      AlarmCount: null,
      MiniappAuthValue: null,
      ImportProgress: null
		}
	},
	getters:{

	},
	actions:{
		SET_EVENT (val:Recordable) {
      if (this.hasOwnProperty(val.type)) {
        (this as any)[val.type] = val.data
      }
    }
	}
})

// Need to be used outside the setup
export function useWsEventWidthOut() {
  return useWsEventStore(store);
}