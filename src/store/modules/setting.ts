import { defineStore } from 'pinia'
import { store } from '@/store';

import setting from '@/config/setting'
let {pageRange, inputNumberMax} = setting
// 配置的state接口
interface Setting {
  pageRange: number[];
  inputNumberMax: number;
  isShowFrame: boolean;
  csmbWindowIndex: number;
	themeData: Nullable<string>;
	isShowModal:boolean;
	showModalList:(string|number)[]
}
// 第一个参数是应用程序中 store 的唯一 id
export const useSettingStore = defineStore('setting', {
  // 其它配置项
	state:():Setting=>{
		return {
			 // 每页数量
			pageRange,
			// 可输入最大数字
			inputNumberMax,
			// 图表配色方案
			// 是否隐藏外框架
			isShowFrame: true,
			csmbWindowIndex: 1, // 展示中心弹窗z-index，每次加1

			// 当前皮肤数据
			themeData: null,
			isShowModal: false,
			showModalList: []
		}
	},
	getters:{

	},
	actions:{
		SET_IS_SHOW_FRAME (newValue:boolean) {
			this.isShowFrame = newValue
		},
		ADD_WINDOW_INDEX () {
			this.csmbWindowIndex++
		},
		SET_THEMEDATA (val:string|null) {
			this.themeData = val
		},
		SET_SHOWMODAL (val:Recordable) {
			// 记录当前弹窗组件
			if (this.showModalList.includes(val.id) && !val.type) {
				this.showModalList.splice(this.showModalList.indexOf(val.id), 1)
			}
			if (!this.showModalList.includes(val.id) && val.type) {
				this.showModalList.push(val.id)
			}
			this.isShowModal = !!this.showModalList.length
			// console.log('弹窗列表', state.showModalList, val)
		},
		CLEAR_SHOWMODAL () {
			this.showModalList = []
			this.isShowModal = false
		},
		toggleFrame () {
			this.SET_IS_SHOW_FRAME(!this.isShowFrame)
		}
	}
})

// Need to be used outside the setup
export function useSettingWidthOut() {
  return useSettingStore(store);
}