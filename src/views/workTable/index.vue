<template>
  <div class="wrap">
    <div class="main" v-show="showModel!=='addCharts'">
      <div class="edit_ctr" v-bind:class="{ edit: model==='edit'}">
        <el-button type="primary" size="small" @click="save">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button size="small" @click="restTable">采用默认工作台</el-button>
        <el-button size="small" @click="clearTable">清空面板</el-button>
      </div>
      <div class="area-main" v-bind:class="{ edit: model==='edit'}">
        <div class="main_left" v-bind:class="{ edit: model==='edit'}">
          <PanelCheck  @openChartsDia="showModel='addCharts'" @checkBoxChang="checkBoxChang" :msg="toPanelCheckData" />
        </div>
        <div class="main_right">
          <!-- 问候，天气 -->
          <div class="greeting">
            <!-- 浮球 -->
            <div class="floatball" @click="clickSetting" v-show="model === 'normal'" >
              <el-icon>
                <Setting/>
              </el-icon>
            </div>
            <div class="greeting_left">
              <div class="user_info">
                <div class="user_icon_box">
                  <i class="iconfont island-user user-icon"></i>
                </div>
                <div class="user_text">
                  <p class="hello">{{greeting}}</p>
                  <p class="time">{{timeEX}}</p>
                </div>
              </div>
            </div>
            <div class="greeting_right">
              <div class="weather_icon">
                <img :src="weather.weather_pic"/>
              </div>
              <!-- <div class="temperature">{{weather.temperature}}℃</div> -->
              <div class="info" v-if="weather.weather">
                <p class="p1">{{weather.weather}}{{' '}}{{weather.night_air_temperature}}℃~{{weather.day_air_temperature}}℃</p>
                <p class="p2">{{weather.area}}</p>
              </div>
              <div class="info" v-else>
                <p class="p1">-- ℃</p>
              </div>
            </div>
          </div>
          <!-- 自定义面板 -->
          <div class="grid">
            <grid-layout
              @layout-ready="handleLayoutReady"
              v-model:layout="layoutData"
              :col-num="3"
              :row-height="314"
              :is-draggable="model==='edit'"
              :is-resizable="model==='edit'"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[24, 24]"
              :use-css-transforms="true"
              @layout-updated="layoutUpdatedEvent"
            >
              <grid-item v-for="item in layoutData" @resized="handleResizeEnd" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :maxW="3" :maxH="2" :key="item.i">
                <component :is="componentDict[item.type]" :layoutDataItem="item" :ref="item.type+item.id" />
                <div class="del_btn" v-show="model === 'edit'" @click="delLayoutItem(item)">
                   <el-icon><Close /></el-icon>
                </div>
              </grid-item>
            </grid-layout>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加图表弹窗 -->
    <AddChartsDialog v-if="showModel==='addCharts'" @close="showModel='normal'" @addCharts="addChartsFn" :layoutData="layoutData" />
  </div>
</template>

<script setup lang="ts">

// import VueGridLayout from 'vue-grid-layout'
import Recently from './component/recently.vue'
import Backlog from './component/backlog.vue'
import FastMenu from './component/fastMenu.vue'
import Notice from './component/notice.vue'
import Announce from './component/announce.vue'
import Charts from './component/charts.vue'
import PanelCheck from './component/panelCheck.vue'
import AddChartsDialog from './component/addChartsDialog.vue'
import { onMounted, ref, computed,nextTick,shallowRef } from 'vue'
import {useUserStoreWidthOut} from "@/store/modules/user";
import Api from '@/api/api'
import {datejs,deepClone} from '@zkzc/fe-utils';


const panelCheckRef = ref<InstanceType<typeof PanelCheck>>();

let model = ref<string>('normal')
let showModel = ref<string>('normal')
let greeting = ref<string|null>('')
let timeEX = ref<string>('')
let weather = ref<Recordable>({})
let layoutData = ref<Array<Recordable>>([])
let oldLayoutData =  ref<Array<Recordable>>([])
let cpStyle = ref<Recordable>({ height: 'auto', backgroundColor: '#f4f5f8', padding: 0 })
let componentDict =shallowRef<Recordable>({
  recentmenu: Recently, // 最近访问
  todo: Backlog, // 待办
  quickmenu: FastMenu, // 快捷菜单
  notification: Notice, // 通知
  announcement: Announce, // 公告
  analysis: Charts // 图表
})
let toPanelCheckData = ref<Array<Recordable>>([])

const name = computed(()=>{
  return $SDK.userInfo.name
})
onMounted(()=>{
  getGreeting()
  getTime()
  getWeather()
})
interface timeLevels{
  start:string,
  end:string
}
 /**
     * 获取问候迎语
     */
function getGreeting () {
  // 当前日期
  let YMD = datejs(new Date()).format('YYYY-MM-DD')

  let levels:Array<timeLevels> = [
    { start: `${YMD} 00:00`, end: `${YMD} 11:29` },
    { start: `${YMD} 11:30`, end: `${YMD} 13:59` },
    { start: `${YMD} 14:00`, end: `${YMD} 17:59` },
    { start: `${YMD} 18:00`, end: `${YMD} 23:59` }
  ]
  let level = null
  levels.forEach((v, i) => {
    if (isDuringDate(v)) {
      level = i + 1
    }
  })
  let greetings:Recordable = {
    1: `早安，${name.value}，祝你开心每一天！`,
    2: `中午好，${name.value}！`,
    3: `下午好，${name.value}！`,
    4: `晚上好，${name.value}！`
  }

  greeting.value = level && greetings[level]
}
/**
 * 当前时间所处范围
 */
function isDuringDate ({start, end}:timeLevels) {
  let c = new Date()
  let s = new Date(start)
  let e = new Date(end)
  if (c >= s && c <= e) {
    return true
  }
  return false
}
/**
 * 获取日期，星期
 */
  function getTime () {
  let now = new Date()
  let day = now.getDay()
  let weeks = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]

  let week = weeks[day]
  let YMD = datejs(now).format('YYYY-MM-DD')
  timeEX.value = YMD + ' ' + week
}
/**
 * 获取天气
 */
function  getWeather () {
  Api()
    .WorkBenchController.get_weather.request()
    .then((res:Recordable) => {
      res.weather_pic = `./images/weather/${
        res.weather_pic || 'day/null.svg'
      }`
      weather.value = res
    })
}
/**
 * 获取工作台面板
 */
function getLayoutData () {
  return new Promise((resolve, reject) => {
    Api()
      .WorkBenchController.get_list.request()
      .then((res:Recordable) => {
        layoutData.value = setLayoutData(res)
        resolve(layoutData.value)
      })
  })
}
function setLayoutData (data:Recordable) {
  let res = data.map((v:Recordable) => {
    let {
      xAxisPosition,
      yAxisPosition,
      width,
      height,
      type,
      id,
      name,
      ownerId,
      analysisType,
      panelItemId
    } = v
    return {
      x: xAxisPosition,
      y: yAxisPosition,
      w: width,
      h: height,
      i: id,
      id,
      type,
      name,
      ownerId,
      analysisType,
      panelItemId
    }
  })
  return res
}
/**
 * 获取工作台面板类型
 */
function  getTypeList () {
  return new Promise((resolve, reject) => {
    Api()
      .WorkBenchController.get_workbench_type_list.request()
      .then((res:Recordable) => {
        let arr = []
        for (let item in res) {
          // 当前面板是否已存在
          let index = layoutData.value.findIndex((v) => v.type === item)

          arr.push({
            type: item,
            name: res[item],
            checked: index !== -1
          })
        }

        toPanelCheckData.value = arr
        resolve(toPanelCheckData.value)
      })
  })
}
// 布局初始化完成时触发，此时布局DOM尺寸还没Ready
const  handleLayoutReady =async () =>{
  await getLayoutData()
  await getTypeList()
}
// 调整面板尺寸结束
function handleResizeEnd () {}
function layoutUpdatedEvent () {}
/**
 * 点击右上角的设置按钮
 */
function clickSetting () {
  model.value = 'edit'
  oldLayoutData.value = deepClone(layoutData.value)
}
/**
 * 编辑面板库
 */
let checkBoxChang = async (data:Recordable) =>{
  // 删除
  if (data.type === 'del') {
    delLayoutItem({ type: data.value }, true)
  } else {
    // 增加
    const widthDict:Recordable = {
      recentmenu: 2,
      todo: 1,
      quickmenu: 2,
      notification: 1,
      announcement: 2,
      analysis: 1
    }
    layoutData.value.unshift({
      x: 0,
      y: computeLastGrid(),
      w: widthDict[data.value],
      h: 1,
      i: new Date().getTime(),
      type: data.value,
      name: data.name
    })
    toPanelCheckData.value.forEach((t) => {
      if (t.type === data.value) {
        t.checked = true
      }
    })
    await nextTick()
    scrollTop()


  }
}
/**
 * 计算最有一个网格的y
 */
function computeLastGrid () {
  let layoutDataClone = deepClone(layoutData.value)
  if (layoutDataClone.length === 0) {
    return 0
  }
  layoutDataClone.sort((a:Recordable, b:Recordable) => {
    return a.y - b.y
  })
  let lastData = layoutDataClone[layoutDataClone.length - 1]
  return lastData.y + 1
}
/**
 * 滚动到最底部
 */
function scrollTop () {
  let body = document.querySelector('.body')
  body && body.scrollTo({
    top: body.scrollHeight + 200,
    behavior: 'smooth'
  })
}
/**
 * 删除面板
 */
function delLayoutItem (item:Recordable, bool?:boolean) {
  let index = layoutData.value.findIndex((v) => {
    if (item.id) {
      return v.id === item.id
    } else {
      if (v.analysisType) {
        return v.analysisType === item.analysisType
      } else {
        return v.type === item.type
      }
    }
  })
  // analysisType
  layoutData.value.splice(index, 1)
  if (!bool && item.type !== 'analysis') {
    toPanelCheckData.value.forEach((t) => {
      if (t.type === item.type) {
        t.checked = false
      }
    })

    panelCheckRef.value?.setData(toPanelCheckData.value)
  }
}
/**
 * 添加新的图表
 */
const addChartsFn = async (data:Array<Recordable>) =>{
  let time = new Date().getTime()
  data.forEach((v, index) => {
    layoutData.value.unshift({
      x: 0,
      y: computeLastGrid(),
      w: 1,
      h: 1,
      i: time + index,
      id: time + index,
      type: 'analysis',
      analysisType: v.type,
      name: v.title,
      panelItemId: v.dataId
    })
  })
  await nextTick()
  scrollTop()
}
/**
 * 保存
 */
const save =  async() =>{
  let data = layoutData.value.map((v) => {
    let { x, y, w, h, id, panelItemId } = v
    let s = {
      xaxisPosition: x,
      yaxisPosition: y,
      width: w,
      height: h,
      id,
      panelItemId
    }
    return { ...v, ...s }
  })
  await Api().WorkBenchController.post_workbench.request({
    data
  })
  model.value = 'normal'
  handleLayoutReady()
}
/**
 * 取消
 */
function cancel () {
  model.value = 'normal'
  layoutData.value = deepClone(oldLayoutData.value)
  PanelCheck.value?.setData(toPanelCheckData.value)
}
/**
 * 恢复默认工作台面板
 */
function restTable () {
  let headers = { hideNotify: true }
  Api()
    .WorkBenchController.post_reset.request({ headers })
    .then((res:Recordable) => {
      layoutData.value = setLayoutData(res)

      toPanelCheckData.value.forEach((t) => {
        let r = layoutData.value.filter((r) => r.type === t.type)
        if (r.length > 0) {
          t.checked = true
        }
      })
      PanelCheck.value?.setData(toPanelCheckData.value)
    })
}
/**
 * 清空面板
 */
function clearTable () {
  layoutData.value = []
  toPanelCheckData.value.forEach((v) => {
    v.checked = false
  })
  PanelCheck.value?.setData(toPanelCheckData.value)
}


</script>
<style >
.grid .vue-grid-item.vue-grid-placeholder {
  background: #f4f5f8 !important;
}
</style>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  .main {
    opacity: 0;
    animation: in 0.5s 1s forwards;
  }
}
// .edit_ctr {
//   height: 0;
//   opacity: 0;
//   line-height: 84px;
//   padding-left: 24px;
//   transition: height 0.5s;
//   &.edit {
//     height: 84px;
//     animation: fade-in 0.8s forwards;
//   }
// }

// .area-main {
//   display: flex;
//   position: relative;
//     &.edit {
//     animation: fade-in 0.8s forwards;
//   }
// }
// .main_left {
//   width: 0;
//   opacity: 0;
//   background-color: #fff;
//   transition: width 0.5s;
//   &.edit {
//     width: 256px;
//     margin: 0 14px 24px 0;
//     animation: fade-in 0.8s forwards;
//   }
// }
.edit_ctr {
  height: 0;
  opacity: 0;
  line-height: 84px;
  padding-left: 24px;
  transition: height 0.5s;
  &.edit {
    height: 84px;
    opacity: 1;
    animation: fade-in 1.2s forwards;
  }
}

.area-main {
  display: flex;
  position: relative;
  animation: fade-out 1.2s forwards;
  &.edit {
    animation: fade-in 1.2s forwards;
  }
}
.main_left {
  width: 0;
  opacity: 0;
  background-color: #fff;
  transition: width 0.5s;
  &.edit {
    width: 256px;
    margin: 0 14px 24px 0;
    animation: fade-in 1.2s forwards;
  }
}
.main_right {
  z-index: 9;
  flex: 1;
}
.greeting {
  // padding: 29px 24px;
  padding: 61px 24px 25px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  background-image: url('../../assets/image/worktable_bg.png');
  background-position: right;
  background-repeat: no-repeat;
  .greeting_left {
    .name {
      font-size: 32px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #0c1014;
      padding-bottom: 20px;
    }
    .user_info {
      display: flex;
    }
    .user_icon_box {
      height: 64px;
      line-height: 64px;
      .user-icon {
        font-size: 64px;
        color: #345ef0;
      }
    }
    .user_text {
      padding-left: 16px;
      font-family: PingFangSC-Medium, PingFang SC;

      .hello {
        font-size: 20px;
        font-weight: bold;
        color: #0c1014;
        padding-top: 2px;
      }
      .time {
        font-size: 14px;
        font-weight: 400;
        color: #4b5869;
        padding-top: 12px;
      }
    }
  }
  .greeting_right {
    // padding-top: 70px;
    display: flex;
    // justify-content:space-around  ;
    & div {
      margin: 0 8px;
    }
    .weather_icon {
      img {
        width: 56px;
        height: 56px;
      }
    }
    .temperature {
      height: 84px;
      font-size: 72px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #4b5869;
      line-height: 84px;
    }
    .info {
      $height: 56px;
      font-size: 14px;
      color: #4b5869;
      height: calc($height);
      // padding-left: 10px;
      p {
        height: calc($height/2);
      }
      .p1 {
        line-height: calc($height/1.5);
      }
      .p2 {
        line-height: calc($height/2.5);
      }
    }
  }
}
.vue-grid-item {
  background-color: #fff;
  border-radius: 4px;
  .del_btn {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 14px;
    background-color: #c3c5ce;
    cursor: pointer;
    color: white;
    width: 20px;
    border-radius: 50%;
    height: 20px;
    line-height: 24px;
    text-align: center;
    &:hover {
      color: #adadad;
    }
  }
}

.floatball {
  width: 48px;
  height: 36px;
  background-color: #345ef0;
  position: absolute;
  right: 0;
  top: 20px;
  z-index: 99;
  cursor: pointer;
  border-left: 1px solid transparent;
  border-top-left-radius: 2em;
  border-bottom-left-radius: 2em;
  text-align: center;
  line-height: 42px;
  font-size: 24px;
  color: #f9f9f9;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
  &:hover {
    color: #e0e6ff;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  } /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  } /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  } /*结束状态 透明度为1*/
}
@keyframes fade-out {
  0% {
    opacity: 0;
  } /*初始状态 透明度为0*/
  40% {
    opacity: 0;
  } /*过渡状态 透明度为0*/
  100% {
    opacity: 1;
  } /*结束状态 透明度为1*/
}

@keyframes in {
  0% {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0%);
    transform: translateX(0%);
    opacity: 1;
  }
}
</style>
