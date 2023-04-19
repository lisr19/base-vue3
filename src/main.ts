import {createApp} from 'vue'
import 'normalize.css'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia"
// ElementPlus
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import '@/assets/css/skin-default.scss'

// 直接引用整个sdk
import api from '@/api/api'
import SDK from '@/utils/dgySdk'
import './permission'


import {store} from '@/store/index'
// 导入svgIcon
import icon from '@/components/icons/index'
//自定义看板
import VueGridLayout from 'vue-grid-layout'
// countTo组件-vue3
import { CountTo } from 'vue3-count-to';
// 添加事件管理者'passive'
import 'default-passive-events'
const app = createApp(App)
app.component('CountTo ', CountTo)

app.use(createPinia()).use(router).use(ElementPlus, {size: 'default',locale: zhCn}).use(icon).use(VueGridLayout).mount('#app');
// vue3 给原型上挂载属性
// app.config.globalProperties.$Api = SDK.api

const Gwindow = (window as any)
Gwindow.$SDK = SDK
Gwindow.$Api = api
Gwindow.$store = store

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


// iconfont
let iconfont = document.createElement('link')
iconfont.rel = 'stylesheet'
iconfont.href = '//at.alicdn.com/t/font_2855345_u19lqy8v928.css'
document.head.appendChild(iconfont)

//svg图标
import 'https://at.alicdn.com/t/font_2855345_u19lqy8v928.js'

