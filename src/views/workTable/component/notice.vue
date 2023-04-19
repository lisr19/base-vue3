<template>
  <div class="worktable_wrap">
    <h2 class="worktable_panel_title">
      <span>通知</span>
      <router-link class="more" to="/operation/messageCenter">更多</router-link>
    </h2>
    <div class="main">
      <div class="tip" v-if="infoList.length===0">暂无数据</div>
      <div v-for="(item,index) in infoList" :key="index" class="list">
        <div class="info" @click="toInfoFn(item)" :title="item.newsInfo">{{item.newsInfo}}</div>
        <div class="time">{{item.createTime}}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {has} from '@/utils/auth.ts'
import {datejs} from '@zkzc/fe-utils';
import {ref,watch,onMounted} from 'vue'
import {useWsEventWidthOut} from '@/store/modules/wsEvent'
import {storeToRefs} from 'pinia'
import Api from '@/api/api'
import { ElMessage } from 'element-plus'

const {NewsCenterValue} = storeToRefs(useWsEventWidthOut())

const infoList = ref<Recordable[]>([])

const NewsCenterValueWatch = watch(NewsCenterValue,(newVal:Recordable,oldVal)=>{
  let { eventId, eventType, newsInfo, newsTypeName, time, id } = newVal
    infoList.value.unshift({
      eventId,
      eventType,
      newsInfo,
      newsTypeName,
      createTime: time,
      id
    })
    if (infoList.value.length > 5) {
      infoList.value.length = 5
    }
},{
  deep:true
})
onMounted(()=>{
  getData()
})
let getData = ()=>{
  let overTime = new Date().getTime()
      let startTime = overTime - 1000 * 60 * 60 * 24 * 2
      startTime = datejs(new Date(startTime)).format('YYYY-MM-DD HH:mm:ss')
      overTime = datejs(new Date(overTime)).format('YYYY-MM-DD HH:mm:ss')

      let headers = { hideNotify: true }
      Api()
        .NewsCenterController.post_findByPage.request({
          data: { pageNum: 1, pageSize: 5, isRead: false, startTime, overTime },
          headers
        })
        .then((res:Recordable) => {
          let content = res.content || []
          content.forEach((v:Recordable) => {
            Object.assign(v, v.newsInfoDetail)
          })
          infoList.value = content
        })
}
let toInfoFn = async (data:Recordable)=>{
  if (!has('100455')) {
      ElMessage({
          message: '没有查看权限',
          type: 'warning',
          duration: 1500
        })
        return
      }
      let newsId = data.id
      let { eventId, eventType } = data.newsInfoDetail
      let headers = { hideNotify: true }
      await Api().NewsCenterController.post_newsCenter.request({
        path: { id: newsId },
        headers
      })
      if (eventType === 'handler' || eventType === 'timeout') {
        eventType = 'Query'
      }
      sessionStorage.setItem(
        'messageCenter_id',
        JSON.stringify({ eventId: eventId, newsId })
      );

      (window as any).parent.frameEvent({
        type: 'routerPush',
        name: eventType
      })
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 16px 19px;
  .list {
    // flex: 1;
    height: 20%;
    display: flex;
    font-size: 14px;
    .info {
      flex: 1;
      padding-right: 8%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      // font-weight: 600;
      color: #0c1014;
      margin: auto 0;
      cursor: pointer;
      &:hover {
        color: #345ef0;
      }
    }
    .time {
      color: #999eb1;
      margin: auto 0;
    }
  }
}

.worktable_panel_title {
  display: flex;
  justify-content: space-between;
  .more {
    font-size: 14px;
    color: #345ef0;
    cursor: pointer;
    padding-top: 2px;
  }
}
.tip {
  color: #c0c4cc;
  text-align: center;
  padding-top: 60px;
}
</style>
