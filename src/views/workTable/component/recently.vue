<template>
  <div class="worktable_wrap">
    <h2 class="worktable_panel_title">最近访问</h2>
    <div class="main">
      <el-row :gutter="17">
        <el-col :span="6" v-for="(item,index) in menuList" :key="index">
          <!-- <router-link class="content" :to="item.url">{{item.appName}}</router-link> -->
          <div class="content"  :to="item.url" @click="handleClick(item)" :title="(item.cascade?item.cascade+'-':'') + item.caption">{{item.caption}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router';
import { ref,onMounted } from 'vue';
import Api from '@/api/api'
import {auth } from '@/utils/dgySdk/index'
//路由
const route = useRoute()
const router = useRouter()


const menuList = ref<Recordable[]>([])
const menuData = ref<Recordable[]>([])

onMounted(()=>{
  getData()
})

const getData = ()=> {
  Api()
    .WorkBenchController.get_recent.request()
    .then((res:Recordable[]) => {
      res  = res || []
      if (res.length > 12) {
        res.length = 12
      }

      if (!res.length) {
        saveRecent()
        return
      }
      menuList.value = res
    })
}
/**
 * 记录访问过的地址
 */
const saveRecent = (data?:Recordable) => {
  let menuData = auth.menuData()

  let routePath = route.path

  // 1级菜单ID过 滤
  menuData.forEach((v) => {
    filterData(v)
  })
  let item:Recordable={}
  if (data){
    item = data
    item.name = item.caption
    item.id = item.menuId
    item.path = item.url
  } else {
    let menuFind = menuData.find((v:Recordable) => v.path === routePath)
    item = menuFind?menuFind:{}
  }
  let { id, name, openType, path, cascade } = item
  let params = {
    cascade,
    caption: name ,
    appName: 'pc',
    menuId: id,
    openType,
    url: path
  }
  !data && (menuList.value = [params])
  let headers = { hideNotify: true }
  Api().WorkBenchController.post_recent.request({
    data: params,
    headers
  })
}
const filterData = (data:Recordable) =>{
  menuData.value.push(data)
  if (data.children) {
    data.children.forEach((v:Recordable) => {
      filterData(v)
    })
  }
}
const handleClick = (data:Recordable) => {
  if (data.openType === 'tag') {
    router.push({ path: data.url })
  } else if (data.openType === 'link') {
    window.open(data.url, '_blank')
  }
  saveRecent(data)
}

</script>

<style lang="scss" scoped>
.main {
  padding: 24px;
  .tip {
    font-size: 14px;
    color: #4b5869;
    margin-bottom: 8px;
  }
  .content {
    display: block;
    height: 36px;
    line-height: 36px;
    padding-left: 16px;
    color: #0c1014;
    font-size: 14px;
    background-color: #f4f5f8;
    border-radius: 4px;
    margin-bottom: 16px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      background-color: #345ef0;
      color: #fff;
    }
  }
}
</style>
