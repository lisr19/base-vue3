<template>
  <div class="worktable_wrap">
    <h2 class="worktable_panel_title">
      <span>公告</span>
      <span class="more" @click="openMore">更多</span>
    </h2>
    <div class="main">
      <div class="tip" v-if="infoList.length===0">暂无数据</div>
      <div v-for="(item,index) in infoList" :key="index" class="list">
        <div class="info" @click="showDetail(item)" :title="item.title">{{ item.title }}</div>
        <div class="time">{{ item.releaseTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'

//路由
const router = useRouter()

const infoList = ref<Recordable[]>([])
const showPreview = ref<boolean>(false)
const noticeDetail= ref<Recordable>({})

onMounted(()=>{
  getData()
})

const openMore = ()=> {
  router.push({ name: 'noticeCenter', params: { from: 'workTable' } })
}

const getData = () => {
  let headers = { hideNotify: true }
  $Api().NoticeCenterController.post_pages.request({
    data: { pageNum: 1, pageSize: 5 },
    headers
  }).then((res:Recordable) => {
    const content = res.content || []
    infoList.value = content
  })
}
const showDetail = (item:Recordable) => {
  noticeDetail.value = item
  $Api.NoticeCenterController.get_noticeCenter.request({
    path: { id: item.id }
  })
  showPreview.value = true
}

</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 16px 24px 16px 19px;

  .list {
    height: 20%;
    display: flex;
    font-size: 14px;

    .info {
      flex: 1;
      padding-right: 8%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
