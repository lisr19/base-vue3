<template>
    <div class="worktable_wrap">
        <h2 class="worktable_panel_title">{{chartData.name}}</h2>
        <div class="main" :id="idName">
            <!-- <div class="main" id="main"> -->

            <component v-if="layoutReady" :isAutoRefresh="true" :is="chartType" :apiUrl="chartData.url" ref="panel" :id="chartData.dataId"></component>
        </div>
    </div>
</template>

<script setup lang="ts">
import setting from '@/config/setting'
import elementResizeDetectorMaker from 'element-resize-detector'
import { ref,PropType,computed,onMounted,nextTick,shallowRef } from 'vue'
import Api from '@/utils/dgySdk/api/api.js'

interface layoutDataType {
    analysisType?:string,
    panelItemId?:string,
    name?:string,
    [propName: string]: any
}
const props = defineProps({
    layoutDataItem: {
        type: Object as PropType<layoutDataType>,
    },
})
interface chartData {
    name?:string,
    x?: number|string,
    y?: number|string,
    w?: number|string,
    h?: number|string,
    i?: string,
    dataId?: number|string,
    type?: number|string,
    formatType?: any,
    url?: string,
    title?: string,
    contentId?: string,
    more?: string
}
const chartData = ref<chartData>({})
const layoutReady = ref<boolean>(false)

interface chart {
    resize:() => void
}
const panel = ref<any & chart>()

const idName = computed(()=>{
    return 'main' + chartData.value.dataId
})
const chartType = shallowRef(null)

onMounted(async ()=>{
    if(!props.layoutDataItem){
        return
    }
    let { analysisType, panelItemId, name } = props.layoutDataItem
    let formatType = chartType.value = analysisType && setting.chartTypeMap[analysisType].component()

    chartData.value = {
        formatType,
        name,
        dataId: panelItemId
    }
    render()

    await nextTick()
    let erd = elementResizeDetectorMaker()
    let timout:any = null
    erd.listenTo(document.getElementById(idName.value), async function () {
        await nextTick()
        if (!timout) {
            timout = setTimeout(() => {
                resize()
                clearTimeout(timout)
                timout = null
            }, 700)
        }

    })
})

 // 获取初始布局数据
 const getLayoutData = () =>{
    // 获取布局数据
    Api().DashboardController.get_dashboardlist.request({
        params: {
            type: 'analysis'
        }
    }).then((res:Recordable) => {
        let arr:chartData[] = []
        if (res && res.length) {
            res.forEach((item:Recordable, index:number) => {
                let { panelItemDTO } = item
                arr.push({
                    x: item.xAxisPosition,
                    y: item.yAxisPosition,
                    w: item.width || 1,
                    h: item.height || 1,
                    i: `${panelItemDTO.id}${index}`,
                    dataId: panelItemDTO.id,
                    type: panelItemDTO.type,
                    formatType: setting.chartTypeMap[panelItemDTO.type].component,
                    url: panelItemDTO.interfaceUrl,
                    title: panelItemDTO.name,
                    contentId: panelItemDTO.id,
                    more: panelItemDTO.itemUrl
                })
            })
        }
        chartData.value = arr[0]
        chartType.value= arr[0].formatType
        render()
    })
}
// 开始渲染图表
const render = ()=>{
    setTimeout(() => {
        // 布局DOM尺寸已经Ready
        layoutReady.value = true
    }, 500)
}
const resize = ()=> {
    panel.value?.resize()
}


</script>

<style lang="scss" >
.worktable_wrap {
  .vue-chart {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.main {
  padding: 16px 6px;
  overflow: auto;
}
</style>
