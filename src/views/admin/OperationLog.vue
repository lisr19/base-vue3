<template>
  <div class="wrap">
    <table-page
      pageName="查询日志"
      :layout="['search','keyFilter','selectAllBtn','selectionCount','pagination']"
      :data="tableListData"
      :filter="filter"
      @search="filterUsersList"
      @resetSearch="resetfilterList"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      ref="table"
      id="operationLog"
      @setTableKeys="tablePageJs.setTableKeys"
      @selectAll="tablePageJs.tableSelectAllStatus"
    >
      <!-- 搜索栏 -->
      <template v-slot:searchFilter>
        <el-form :inline="true" :model="filter" label-width="100px" size="small">
          <el-form-item label="操作时间" class="search2x">
            <el-date-picker
                size="medium"
              v-model="filter.time"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :editable="false"
              :picker-options="pickerOptionsObject"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="日志类型">
            <el-select v-model="filter.condition.operationType" placeholder="请选择日志类型" clearable>
              <el-option value label="全部"></el-option>
              <el-option v-for="(item,index) in types" :key="item.code+index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作用户">
            <el-autocomplete class="inline-input" v-model="filterLoginName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect" clearable></el-autocomplete>
          </el-form-item>
          <el-form-item label="操作对象">
            <el-select v-model="filter.condition.operationObject" placeholder="请选择操作对象" clearable>
              <el-option value label="全部"></el-option>
              <el-option v-for="(item,index) in operationObsjects" :key="item.code+index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作结果">
            <el-select v-model="filter.condition.operationResult" placeholder="请选择操作结果" clearable>
              <el-option value label="全部"></el-option>
              <el-option value="1" label="成功"></el-option>
              <el-option value="0" label="失败"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <!-- 控制栏 -->
      <template v-slot:controller>
        <el-button size="small" plain @click="dataExport()" style="margin-left:10px" v-if="has('100027')">
            <el-icon color="gray" style="margin:0 4px;"><Download /></el-icon>导出日志</el-button>
      </template>
    </table-page>
  </div>
</template>

<script setup lang="ts">
import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { pickerOptions } from '@/utils/datePickerDefault.ts'
import moment from 'moment'
import { formatDate } from '@/utils/global'

import TablePage from '@/gitsubmodule/tablePage/TablePage/TablePage.vue'
import tablePageJs from '@/gitsubmodule/tablePage/TablePage/TablePage.js'
import { watch, onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const logsListData = ref<Recordable>([])

const filter = ref<Recordable>({
    condition: {
        // 操作时间–开始时间
        operationTimeStart: '',
        // 操作时间–结束时间
        operationTimeEnd: '',
        // 操作类型
        operationType: '',
        // 操作用户ID
        userId: '',
        // 操作对象
        operationObject: '',
        // operationResult
        operationResult: ''
    },
    time: [
        moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        moment().format('YYYY-MM-DD HH:mm:ss')
    ],
    pageSize: 10, // 每页条数
    pageNum: 1, // 当前页
    rowTotal: null // 总条数
})

const tableListData = computed(()=>{
    return {
        selection: false, // 是否显示选择框
        tableData: logsListData.value,
        tableKeys: [
          // 表格标签
          {
            id: 'startTime',
            label: '操作时间',
            allways: true
          },
          {
            id: 'userName',
            label: '操作用户',
            allways: true
          },
          {
            id: 'ip',
            label: '操作ip'
          },
          {
            id: 'operationType.name',
            label: '日志类型'
          },
          {
            id: 'operationObject',
            label: '操作对象'
          },
          {
            id: 'operationResult',
            label: '操作结果'
          }
        ]
      }
})

// 获取用户列表数据
const getGridData = () => {
    if (filter.value.time) {
    filter.value.condition.operationTimeStart = filter.value.time[0]
    filter.value.condition.operationTimeEnd = filter.value.time[1]
    if (
        new Date(filter.value.time[1]).getTime() -
        new Date(filter.value.time[0]).getTime() >
        15 * 24 * 3600 * 1000
    ) {
        ElMessage.error('查询时间跨度不能大于15天!')
        return
    }
    } else {
    ElMessage.error('查询时间不能为空')
    return
    }
    filter.value.page = filter.value.pageNum

    window.$Api()
    .OperationLogController.post_records.request({
        data: filter.value,
        headers: {
        hideNotify: true
        }
    })
    .then((res:any) => {
        logsListData.value = res.data

        // 格式化修改时间
        logsListData.value.forEach((item:any) => {
        if (item.startTime) {
            item.startTime = formatDate(
            new Date(item.startTime),
            'Y-M-D h:i:s'
            )
        }
        })

        filter.value.rowTotal = res.total
    })
}

const types = ref<Recordable>([])

// 获取枚举类型
const getTypes = () => {
    window.$Api()
    .OperationLogController.get_types.request({
        headers: {
        hideNotify: true
        }
    })
    .then((res:any) => {
        types.value = res
    })
}

const operationObsjects = ref<Recordable>([])


// 获取操作对象枚举
const getOperationObsject = () =>{
    window.$Api()
    .OperationLogController.get_objects.request({
        headers: {
        hideNotify: true
        }
    })
    .then((res:any) => {
        operationObsjects.value = res
    })
}

onMounted(()=>{
    getGridData()
    // 获得事件类型
    getTypes()
    // 获得操作结果
    getOperationObsject()
})

const filterLoginName = ref('')

const restaurantsAll = ref<Recordable>([])

watch(()=>filterLoginName.value,async(newVal) => {
    if (newVal === '') {
    filter.value.condition.userId = ''
    } else {
    for (let i = 0; i < restaurantsAll.value.length; i++) {
        const item = restaurantsAll.value[i]
        if (newVal === item.name) {
        filter.value.condition.userId = item.id
        break
        } else {
        filter.value.condition.userId = ''
        }
    }
    }
})

// 搜索用户
const filterUsersList = () => {
    filter.value.pageNum = 1
    getGridData()
}

// 重置搜索
const resetfilterList = () => {
    filter.value.condition.operationTimeStart = ''
    filter.value.condition.operationTimeEnd = ''
    filter.value.condition.operationType = ''
    filter.value.condition.userId = ''
    filter.value.condition.operationObject = ''
    filter.value.condition.operationResult = ''
    filter.value.time = [
    moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    moment().format('YYYY-MM-DD HH:mm:ss')
    ]
    filter.value.pageSize = 10
    filter.value.pageNum = 1
    filterLoginName.value = ''
    getGridData()
}

// 更改每页数量
const handleSizeChange = (newValue:number) => {
    filter.value.pageSize = newValue
    getGridData()
}

// 翻页
const handleCurrentChange = (newPageNumber:number) => {
    filter.value.pageNum = newPageNumber
    getGridData()
}

const restaurants = ref<Recordable>([])

const loadAll = (queryString:string) => {
    return new Promise((resolve, reject) => {
    window.$Api()
        .TenantUserController.get_all.request({
        params: {
            name: queryString
        },
        headers: {
            hideNotify: true,
            hideLoading: true
        }
        })
        .then((res:any) => {
        restaurants.value = res
        restaurantsAll.value = JSON.parse(JSON.stringify(res))
        if (res.length) {
            resolve()
        } else {
            ElMessage({
            message: '无当前操作用户',
            type: 'error',
            duration: 2 * 1000
            })
            reject(new Error())
        }
        })
    })
}


const createStateFilter = (queryString:string) => {
    return (state:any) => {
    return state.name.indexOf(queryString) !== -1
    }
}

const querySearchAsync = async (queryString:string, cb:any) => {
    await loadAll(queryString)
    let restaurantsSub = restaurants.value
    let results = queryString
    ? restaurantsSub.filter(createStateFilter(queryString))
    : restaurantsSub
    results.forEach((item:any) => {
    item.value = item.name
    })
    cb(results)
}

const handleSelect = (item:any) => {
    filter.value.condition.userId = item.id
}

// 查询条数
const findTotalNumber = () => {
    return new Promise((resolve:any, reject) => {
    window.$Api()
        .OperationLogController.post_totalNumber.request({
        data: {
            operationTimeStart: filter.value.condition.operationTimeStart,
            operationTimeEnd: filter.value.condition.operationTimeEnd,
            operationType: filter.value.condition.operationType,
            userId: filter.value.condition.userId,
            operationObject: filter.value.condition.operationObject,
            operationResult: filter.value.condition.operationResult
        },
        headers: {
            hideNotify: true
        }
        })
        .then((res:any) => {
        if (res > 5000) {
            ElMessage({
            message: '导出日志过大，限制最多可导出5000条',
            type: 'error',
            duration: 5 * 1000
            })
        }
        resolve()
        })
    })
}

// 导出日志
const dataExport = async () => {
    await findTotalNumber()
    window.$Api().OperationLogController.post_export.request({
    data: {
        condition: {
        operationTimeStart: filter.value.condition.operationTimeStart,
        operationTimeEnd: filter.value.condition.operationTimeEnd,
        operationType: filter.value.condition.operationType,
        userId: filter.value.condition.userId,
        operationObject: filter.value.condition.operationObject,
        operationResult: filter.value.condition.operationResult
        },
        pageSize: 5000,
        page: 1
    },
    responseType: 'blob'
    })
}

const pickerOptionsObject = ref(pickerOptions())

const state = ref('')
const timeout = ref()
</script>

<style lang="scss"  rel="stylesheet/scss">

</style>
