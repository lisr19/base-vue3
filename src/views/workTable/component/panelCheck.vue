<template>
  <div class="worktable_wrap">
    <h2 class="worktable_panel_title">
      <span class="title">面板库</span>
      <el-button link @click="openChartsDia">
        <i class="iconfont island-jia"></i> 添加报表
      </el-button>
    </h2>
    <div class="main">
      <el-checkbox-group v-model="checkList" class="checkbox-group" @change="checkBoxChang">
        <el-checkbox v-for="(item,index) in checkboxList" :label="item.type" :key="index">{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import {watch,ref} from 'vue'

const props = defineProps({
    msg: {
      type: Array,
      default: () => {
        return []
      }
    }
})

const emits = defineEmits(['openChartsDia','checkBoxChang'])

const checkboxList = ref<Recordable>([])
const checkList = ref<Recordable>([])
const oldCheckList = ref<Recordable>([])


const setData = (v:any) => {
    checkboxList.value = JSON.parse(JSON.stringify(v))
    let checkeds = v.filter((i:any) => i.checked)
    checkList.value = checkeds.map((i:any) => i.type)
    oldCheckList.value = JSON.parse(JSON.stringify(checkList.value))
}

watch(()=>props.msg,(v)=>{
    setData(v)
})

const openChartsDia = () => {
    emits('openChartsDia')
}

const checkBoxChang = (data:any) => {
    console.log(data)
    let obj = {}
    oldCheckList.value.forEach((v:any) => {
    if (!data.includes(v)) {
        obj = {
        type: 'del',
        value: v
        }
    }
    })
    data.forEach((v:any) => {
    if (!oldCheckList.value.includes(v)) {
        obj = {
        type: 'add',
        value: v,
        name: checkboxList.value.filter((f:any) => f.type === v)[0].name
        }
    }
    })
    oldCheckList.value = JSON.parse(JSON.stringify(data))
    emits('checkBoxChang', obj)
}

</script>

<style lang="scss" scoped>
.main {
  padding: 20px 10px;
  .title {
    margin: auto 0;
  }
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #0c1014;
  padding-left: 70px;
  line-height: 40px;
}
:deep(.el-checkbox__label) {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: -4px;
}
.worktable_panel_title {
  display: flex;
  justify-content: space-between;
}
</style>
