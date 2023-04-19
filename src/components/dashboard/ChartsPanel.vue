<!--所有图表筛选面板 -->
<template>
    <div class="el-main-body el-main-body-pop charts-panel-container">
        <div class="analysis-area-sub" :style="areaSubStyle">
            <div class="analysis-area-sub-title">图表目录</div>
            <el-tabs class="analysis-area-tab" v-model="activeTabName" @tab-change="tabChange">
                <el-tab-pane label="类别" name="statisticType">
                    <div class="analysis-area-sub-list">
                        <div class="sub-item" :class="{'active':currentStatisticType.value === item.value}" v-for="item in statisticTypeList" :key="item.value" @click="handleChangeTypeOrTag(item)">{{item.label}}</div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="标签" name="tag">
                    <div class="analysis-area-sub-list">
                        <div class="sub-item" :class="{'active':currentReportTag.uKey === item.uKey}" v-for="item in reportTagList" :key="item.uKey" @click="handleChangeTypeOrTag(item)">{{item.value}}</div>
                    </div>
                </el-tab-pane>
            </el-tabs>

        </div>
        <div class="analysis-area-main" :style="areaMainStyle">
            <div>
                <div class="chart-search">
                    <el-form :inline="true" :model="filter" class="search-form" label-width="100px" @submit.native.prevent>
                        <el-form-item label="图表名称">
                            <el-input v-model="filter.name" size="small" placeholder="请输入图表名称" clearable />
                        </el-form-item>
                        <el-form-item label="图表类型">
                            <!-- <el-input v-model="filter.name" placeholder="输入设备图表名字" @keydown.enter.native="inputKeyDown" key="filter.name"/> -->
                            <el-select v-model="filter.type" size="small" placeholder="请选择图表类型" clearable >
                                <el-option value key=" " label="全选"></el-option>
                                <el-option v-for="item in allTypes" :value="item.value" :key="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" native-type="button" size="small" @click="search">搜索</el-button>
                            <el-button native-type="button" size="small" @click="resetSearch">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if="gridData && gridData.length" class="chart-grid">
                    <!-- <el-row :gutter="24">
          <el-col  :span="8" v-for="item in gridData" :key="item.id">-->
                    <div class="chart-item-box" v-for="item in gridData" :key="item.id">
                        <div class="chart-gird-title">
                            <p class="tit">
                                {{item.title}}
                                <el-tooltip class="desc" placement="top" v-if="item.description" popper-class="chart-desc">
                                    <template v-slot:content>{{item.description}}</template>
                                    <img class="description-icon" src="../../assets/image/icon/question-icon.svg" alt />
                                </el-tooltip>
                            </p>

                            <el-checkbox v-model="item.checked" size="default" v-if="mode === 'add'" :disabled="checkeds.includes(item.id)"></el-checkbox>
                            <div class="op-btn-box" v-if="mode !== 'add' && item.editable">
                                <el-button class="op-btn" link @click="handleEdit(item.id)">编辑</el-button>
                                <el-button class="op-btn" link @click="handleDelete(item.id)">删除</el-button>
                            </div>
                        </div>
                        <div class="chart-gird-item iscroll">
                            <el-button-group v-if="focusBtnValue[item.id] && item.metricsDes.length>1 && item.metricsDes[0].x==='time'" class="dimension-btn-group">
                                <el-button
                                    :type="focusBtnValue[item.id]===v.xValue.split(',').slice(-1)[0]?'primary':''"
                                    v-for="(v,k) in item.metricsDes"
                                    class="dimension-btn"
                                    :key="k"
                                    size="small"
                                    @click="changeDimension(item.id,k)"
                                >
                                    {{timeTypeMap[v.xValue.split(',').slice(-1)[0]]}}
                                </el-button>
                            </el-button-group>
                            <component
                            :is="item.formatType()"
                            :apiUrl="item.url"
                            :ref="`panel${item.id}`"
                            :showLegend="true"
                            :id="item.dataId"
                            :metricsDes="item.metricsDes"
                            ></component>


                        </div>
                    </div>
                </div>

                <div v-if="gridData && gridData.length" class="pagination-wrapper">
                    <pagination
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        v-model:currentPage="page.pageNumber"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="total,  prev, pager, next, jumper"
                        background
                        :total="page.rowTotal"
                    />
                </div>
            </div>
            <div v-if="!gridData || gridData.length === 0">
                <div class="common-empty-wrapper">
                    <img class="common-empty-img" :src="emptyImg" />
                    <span class="common-empty-text">暂无数据</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import emptyImg from '@/assets/image/icon/icon-table-empty.png'
import { getStatisticTypeList, getTagTypeList,setTagTypeList } from '@/utils/dict.js'
import { getChartType } from '@/config/setting.ts'
import { getDataViaProp } from '@/utils'
import pagination from '@/components/pageination/pageination.vue'
import { getTimeType } from '@/api/report'
import {onMounted,ref,nextTick, defineAsyncComponent} from 'vue'
import { ElMessageBox } from 'element-plus'
import { getTagType } from '@/api/report.js'


const props = defineProps({
    checkeds: {
        type: Array,
        default: () => {
            return []
        }
    },
    layoutData: {
        type: Array,
        default: () => {
            return []
        }
    },
    mode: {
        type: String,
        default: 'normal' // 普通模式normal 可点击编辑  //选择模式 add 可点击添加
    },
    areaSubStyle: {
        type: Object,
        default: () => {
            return {}
        }
    },
    areaMainStyle: {
        type: Object,
        default: () => {
            return {}
        }
    }
})


//  待选类型
const allTypes = ref()

// 获取报表类型
const getAllTypes = () => {
    window.$Api()
        .PanelItemController.get_panelItemType.request({
            params: {
                dashboardType: 'analysis'
            }
        })
        .then((res:any) => {
            allTypes.value = res
        })
}

const timeTypeMap = ref()

// 获取时间维度集合
const getTimeTypes = async () => {
    const timeTypeList:any = await getTimeType()
    const timeTypeMapInner:any = {}
    timeTypeList.forEach((item:any) => {
        const { uKey, value } = item
        !timeTypeMapInner[uKey] && (timeTypeMapInner[uKey] = value)
    })
    timeTypeMap.value = timeTypeMapInner
}

const statisticTypeList = ref<Recordable>([])
// 当前图表类型目录
const currentStatisticType = ref<Recordable>({})

const emits = defineEmits(['getCurrentStatisticType','getCurrentReportTag','edit'])
const reportTagList = ref<Recordable>([])
const chartLoading = ref(false)
const page = ref<Recordable>({
    pageNumber: 1,
    pageSize: 6,
    pageSizes: [6, 12],
    rowTotal: null
})
// 当前图表标签目录
const currentReportTag = ref<Recordable>({})
const filter = ref<Recordable>({
    name: '',
    type: ''
})
// 列表数据
const gridData = ref<Recordable>([])
const panelRefArr = ref<Recordable>({})

const getGridData = () => {
    chartLoading.value = true
    return window.$Api()
        .PanelItemController.post_panelItemPage.request({
            data: {
                panelItemCriteria: {
                    pageSize: page.value.pageSize,
                    pageNum: page.value.pageNumber,
                    dashboardType: 'analysis',
                    statisticType: currentStatisticType.value.value || '', // 统计类型
                    tag: currentReportTag.value.uKey || '',
                    name: filter.value.name,
                    type: filter.value.type
                }
            },
            headers: {
                // hideLoading: true,
                hideNotify: true
            }
        })
        .then((res:any) => {
            chartLoading.value = false
            let arr:any = []

            console.log(res);

            res.content.forEach((item:any) => {
                let { id, type, outward, name, interfaceUrl, editable, updateTime, metricsDes, description } = item
                arr.push({
                    id: id,
                    checked: false,
                    dataId: id,
                    type: type,
                    outward,
                    formatType: getChartType({ type, outward }),
                    title: name,
                    url: interfaceUrl,
                    editable: Boolean(editable),
                    updateTime: updateTime ? updateTime.split(' ')[0] : '',
                    description,
                    metricsDes
                })
            })
            gridData.value = arr

            for(let i=0;i<arr.length;i++){
                panelRefArr.value[`panel${i}`] = ref()
            }

            page.value.pageNumber = res.pageNum
            page.value.pageSize = res.pageSize
            page.value.rowTotal = res.totalElements
        })
}

onMounted(async()=>{
    getAllTypes()
    getTimeTypes()
    statisticTypeList.value = JSON.parse(JSON.stringify(getStatisticTypeList()))
    statisticTypeList.value.unshift({ label: '全部', value: '' })
    currentStatisticType.value = statisticTypeList.value[0]
    emits('getCurrentStatisticType', currentStatisticType)
    const res = await getTagType()
    setTagTypeList(res)
    reportTagList.value = getTagTypeList()
    console.log(reportTagList.value);

    getGridData()
})


const search = () => {
    gridData.value.forEach((v:any) => {
        v.checked = false
    })
    nextTick(() => {
        page.value.pageNumber = 1
        getGridData()
    })
}

const resetSearch = () => {
    page.value.pageNumber = 1
    filter.value = {
        name: '',
        type: ''
    }
    getGridData()
}



// 切换分析时间维度
const changeDimension = (id:any, metricsDesIdx:any) => {
    // const chartBox = this.$refs[`panel${id}`][0]
    const chartBox = panelRefArr.value[`panel${id}`].value[0]
    chartBox.getData(metricsDesIdx)
}

// 请求过滤参数
const filterData_params = ref<Recordable>({})
 // 过滤表单
 const filterData = ref<Recordable>({
    // appId: '',
    type: '',
    departmentIds: []
})

// 过滤列表
const filterChart = () => {
    page.value.pageNumber = 1
    filterData_params.value = Object.assign({}, filterData.value)
    getGridData()
}

// 更改每页数量
const handleSizeChange = (newValue:any) => {
    page.value.pageSize = newValue
    getGridData()
}

// 翻页
const handleCurrentChange = (newPageNumber:any) => {
    page.value.pageNumber = newPageNumber
    getGridData()
}

// 编辑保存后 更新ChartItem的数据
const updateChartItem = async (data:any) => {
    await getGridData()
    // 调用子组件的获取数据方法更新子组件数
    let currentIndex = gridData.value.findIndex((item:any) => item.id === data.id)
    gridData.value[currentIndex].type = data.type
    gridData.value[currentIndex].formatType = getChartType({ type: data.type, outward: data.outward })
    panelRefArr.value[`panel${data.id}`].value[0].getData()
}

// 所属部门树修改，触发搜索
const handleCheckChange = (items:any) => {
    let arr = getDataViaProp(items, 'id')
    filterData.value.departmentIds = arr
    filterChart()
}

const activeTabName = ref('statisticType')

const handleChangeTypeOrTag = (current:any) => {

    page.value.pageNumber = 1
    filter.value = {
        name: '',
        type: ''
    }
    if (activeTabName.value === 'statisticType') {
        currentStatisticType.value = current
        currentReportTag.value = {}
    } else {
        currentReportTag.value = current
        currentStatisticType.value = {}
    }
    emits('getCurrentStatisticType', currentStatisticType.value)
    emits('getCurrentReportTag', currentReportTag.value)
    getGridData()
}


const tabChange = ()=>{
    console.log('tabChange');
    if (activeTabName.value === 'statisticType') {
        handleChangeTypeOrTag(statisticTypeList.value[0])
    } else {
        handleChangeTypeOrTag(reportTagList.value[0])

    }
}

const handleEdit = (id:any) => {
    if (props.mode === 'normal') {
        emits('edit', id)
    }
}

const handleDelete = (id:string) => {
    ElMessageBox.confirm('是否确认删除该报表？', '删除', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'error'
    }).then((_) => {
        window.$Api()
            .PanelItemController.delete_panelItem.request({
                params: {
                    id
                }
            })
            .then(() => {
                page.value.pageNumber = 1
                getGridData()
            })
    })
}

const statisticTypeMapping = ref({})
const focusBtnValue = ref<Recordable>({})

</script>
<style lang="scss" scoped>
.charts-panel-container {
  position: relative;
  display: flex;
  height: 100%;
  margin: 0;
  background: rgb(244, 245, 248);
  border: 0;
  .analysis-area-sub {
    width: 150px;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
  }
  .analysis-area-sub-list {
    margin-top: 24px;
  }
  .analysis-area-sub-title {
    height: 56px;
    line-height: 56px;
    padding-left: 20px;
    color: #0c1014;
    font-size: 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  :deep(.analysis-area-tab){
    .el-tabs__header {
        margin: 0;
        .el-tabs__nav-scroll{
        display: flex;
        justify-content: center;
        }
    }
  }
  .analysis-area-main {
    flex: 1;
    padding: 24px 12px;
    background-color: #fff;
    overflow-y: auto;
    height: 100%;
    border-radius: 4px;
  }
  .sub-item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    &.active {
      color: #345ef0;
      background: #eaeefd;
    }
  }
  .pagination-wrapper {
    //position: absolute;
    //right: 20px;
    //bottom: 20px;
    margin-top: 10px;
    text-align: right;
  }
}
</style>
<style lang="scss"  rel="stylesheet/scss">
.chart-grid {
  display: flex;
  flex-wrap: wrap;
  .chart-item-box {
    margin: 0.5% 0.5% 14px;
    width: 32%;
    border: 1px solid #eee;
    border-radius: 4px;
    &:hover {
      .op-btn-box {
        display: block;
      }
    }
  }
  .chart-gird-item {
    position: relative;
    background-color: #fff;
    height: 255px;
    overflow: auto;
    .vue-chart {
      position: relative;
      width: 100%;
      height: calc(100% - 35px);
    }
    .error {
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 0.5em;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #677a84;

      i {
        font-size: 30px;
      }
    }

    .chart-grid-item-opt {
      opacity: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 0px 10px;
      text-align: center;
      font-size: 16px;
      transition: opacity 0.2s ease-in-out;
      line-height: 280px;
      z-index: 10;
    }

    &:hover {
      border-color: #2f89ef;

      .chart-grid-item-opt {
        opacity: 1;
      }
    }
    .dimension-btn-group{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        .dimension-btn{
            padding: 3px;
        }
    }
  }
  .chart-gird-title {
    padding: 14px 10px 14px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    .tit {
      //margin-bottom: 6px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #0c1014;
      display: flex;
      align-items: center;
      .desc{
        cursor: pointer;
        margin-left: 5px;
      }
    }
    .el-checkbox__inner {
      border: 1px solid #666;
    }
  }
  .tit2 {
    padding: 4px 10px 10px;
    color: #999eb1;
  }
  .op-btn-box {
    display: none;
    width: 84px;
    text-align: right;
    flex-shrink: 0;
    .op-btn {
      padding: 0;
    }
  }
  .chart-gird-sub-title {
    padding: 0 10px 10px;
    color: #999eb1;
    font-size: 14px;
  }
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    &::after {
      left: 6px;
      top: 3px;
    }
  }
}
.chart-desc{
    background-color: #000 !important;
    box-shadow: 0px 1px 3px 0px rgba(25,26,31,0.15) !important;
    opacity: 0.75 !important;
    font-size: 12px !important;
    font-family: PingFangSC-Regular, PingFang SC !important;
    font-weight: 400 !important;
    color: #FFFFFF !important;
}
</style>
