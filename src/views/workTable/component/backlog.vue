<template>
  <div class="worktable_wrap">
    <h2 class="worktable_panel_title">待办事项</h2>
    <div class="main">
      <div class="block" v-for="(item,index) in info" :key="index">
        <div class="icon">
          <el-badge :value="item.count" :max="99" class="badge" :hidden="item.count===0||item.value==='join'||item.value==='initiatege'">
            <i class="iconfont" :class="['island-'+item.value, item.value]" @click="handle(item)"></i>
          </el-badge>
        </div>
        <div class="title">{{item.label}}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import { useRouter } from 'vue-router';
import Api from '@/api/api'

// 路由
const router = useRouter()

const info = ref<Recordable[]>([])
const dict = ref<String[]>(['handle', 'join', 'initiatege'])

onMounted(async ()=>{
  let res = await Api().TaskManagementController.post_taskEnum.request({
    headers: {
      hideNotify: true,
      hideLoading: true
    }
  })
  let res2 = await Api().TaskManagementController.get_myTaskPageCount.request()
  dict.value.forEach((v:any) => {
    let item = res.tag.find((f:Recordable) => f.value === v)
    item.count = res2[v] || 0
    info.value.push(item)
  })
  info.value.push({
    label: '发起工单',
    value: 'order'
  })
})

const handle = (data:Recordable) =>{
  router.push({ name: 'Todo', params: { type: data.value } })
}

</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  // justify-content: center;
  padding: 16px;
  .block {
    margin-top: -10px;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .icon {
      height: 64px;
      line-height: 64px;
      cursor: pointer;
      .iconfont {
        font-size: 64px;
      }
      .handle {
        color: #ffc152;
      }
      .join {
        color: #40b9fe;
      }
      .initiatege {
        color: #345ef0;
      }
      .order {
        color: #34da49;
      }
    }
    .title {
      font-size: 14px;
      color: #0c1014;
      font-weight: 400;
      text-align: center;
      padding-top: 17px;
    }
  }
}

:deep(.el-badge__content.is-fixed) {
  right: 24px;
}
</style>
