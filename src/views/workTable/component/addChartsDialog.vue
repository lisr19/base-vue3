<template>
  <CoverPage title="添加报表" :cpStyle="{background: '#f4f5f8',padding: '5px'}" v-if="show" @back="$emit('close')" ref="cover">
    <template v-slot:titleBar>
      <el-button type="primary" size="small" @click="handleSaveAdd">添加</el-button>
    </template>
    <template v-slot:contentSlot>
      <charts-panel ref="chartPanel" mode="add" :checkeds="checkeds"></charts-panel>
    </template>
  </CoverPage>
</template>

<script setup lang="ts">
import CoverPage from '@/components/CoverPage.vue'
import ChartsPanel from '@/components/dashboard/ChartsPanel'
import { ElMessage } from 'element-plus'
import { setStatisticTypeList } from '@/utils/dict.js'
import { computed,onMounted,ref, } from 'vue'

const props = defineProps({
    layoutData:{
        type:Array,
        default: ()=>{
            return []
        }
    }
})


const checkeds = computed(()=>{
    console.log(props.layoutData.map((v:any) => v.panelItemId))
    return props.layoutData.map((v:any) => v.panelItemId)
})

const show = ref(false)

const getStatisticTypeList = async () => {
    await window.$Api()
    .PanelItemController.get_statisticType.request()
    .then((res:any) => {
        setStatisticTypeList(res)
        show.value = true
    })
}

onMounted(()=>{
    getStatisticTypeList()
})

const chartPanel = ref()
const emits = defineEmits(['addCharts'])
const cover = ref()

const handleSaveAdd = () => {
    let addChartList = chartPanel.value.gridData.filter(
    (item:any) => item.checked
    )
    console.log(addChartList)
    if (addChartList.length) {
    emits('addCharts', addChartList)
    cover.value.back()
    } else {
    ElMessage({
        message: '请选择你要添加的报表',
        type: 'warning'
    })
    }
}

</script>

<style lang="scss" scoped>
</style>
