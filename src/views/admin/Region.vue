<template>
  <div style="position: relative" class="area">
    <div class="area-sub background-white">
      <group-tree-box
        @chooseGroupNode="chooseGroupNode"
        ref="treebox"
        @update="handleEditCurrRegion"
        @delete="handleRemoveRegion"
        :treeData="treeData"
        :expandedKeys="expandedKeys"
        :authIds="{ updateId: '100019', deleteId: '100020' }"
      />
    </div>
    <div class="area-main background-white">
      <div class="area-main-desc">
        <div class="area-main-head" style="font-weight: bold">
          <h4>当前区域信息</h4>
        </div>
        <p>区域名称: {{ currNodeData.name }}</p>
        <p>区域描述: {{ currNodeData.description }}</p>
      </div>
      <div class="area-table">
        <table-page
          pageName="区域管理"
          :layout="['search','keyFilter','selectAllBtn','selectionCount','pagination']"
          :data="tableListData"
          :filter="filter"
          @search="search"
          @resetSearch="resetSearch"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          ref="table"
          id="region"
          @setTableKeys="tablePageJs.setTableKeys"
          @selectAll="tablePageJs.tableSelectAllStatus"
        >
          <template v-slot:info>
            <div class="area-main-head" style="
                padding: 10px 0;
                margin: -20px 0px 10px -10px;
                font-weight: bold;
              ">
              <h4>下属区域</h4>
            </div>
          </template>
          <!-- 搜索栏 -->
          <template v-slot:searchFilter>
            <el-form :inline="true" :model="filter" class="demo-form-inline" label-width="100px" @submit.native="$event.preventDefault();search()">
              <el-form-item label="区域名称">
                <el-input v-model="filter.regionName" size="small" placeholder="请输入区域名称" clearable></el-input>
              </el-form-item>
            </el-form>
          </template>
          <!-- 控制栏 -->
          <template v-slot:controller>
            <el-button type="primary" @click="handleAddRegion" v-if="has('100018')" size="small">
                <el-icon color="#fff" style="margin:0 4px;"><Plus /></el-icon>添加区域</el-button>
          </template>
        </table-page>
      </div>
    </div>


    <!--区域表单-->
    <el-dialog :title="descDict.title[dialogMode]" v-model="dialogVisible" :append-to-body="true" :close-on-click-modal="false" width="600px" @close="resetForm">
      <el-form :model="form" ref="dpForm" :rules="dpRules" style="margin-right: 102px">
        <el-form-item label="区域名称" prop="regionName" :label-width="formLabelWidth">
          <el-input v-model="form.regionName" :placeholder="dpRules.regionName[0].message"></el-input>
        </el-form-item>
        <el-form-item label="上级区域" prop="parentDepartmentId" :label-width="formLabelWidth">
          <el-input v-model="form.parentregionName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="区域描述" prop="regionDesc" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.regionDesc" :placeholder="dpRules.regionDesc[0].message"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="中心位置" prop="lnglat" class="center-position">
          <div class="location-des" v-show="form.location.length">经度：{{ form.location[0] }} 纬度：{{ form.location[1] }}</div>
          <div class="location-des">(中心位置用于在地图上按区域聚合展示)</div>
          <el-button class="plain-button" type="primary" size="small" plain @click="handleMapLocation"><el-icon color="#345ef0"><LocationFilled /></el-icon>定位</el-button>
        </el-form-item>
      </el-form>
      <template v-slot:footer class="dialog-footer">
        <el-button @click="handleCancel" size="small">取消</el-button>
        <el-button type="primary" @click="handleSave()" size="small">保存</el-button>
      </template>
    </el-dialog>
    <!---地图定位-->
    <map-location v-if="showMapLocation"
      ref="map"
      :lnglat="{
        lng:
          form.location[0] ||
          (currNodeData.location && currNodeData.location.coordinates[0]) ||
          116.395134,
        lat:
          form.location[1] ||
          (currNodeData.location && currNodeData.location.coordinates[1]) ||
          39.925329,
      }"
      @setLocate="setLocate" @closeDialog="showMapLocation = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref, computed } from 'vue'
import { validateRule } from '@/utils/global'
import GroupTreeBox from '@/components/GroupTreeBox/index'
import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { delText,chooseLocation } from '@/utils/suggestiveText.ts'

import '@/assets/system.scss'
import MapLocation from '@/components/MapLocation/'

import TablePage from '@/gitsubmodule/tablePage/TablePage/TablePage.vue'
import tablePageJs from '@/gitsubmodule/tablePage/TablePage/TablePage.js'

import { allTableFunction } from '@/utils/auth.ts'

const tableData = ref<Recordable>([])
const showMapLocation = ref(false)
const filter = ref<Recordable>({
    pageSize: 10, // 每页条数
  pageNum: 1, // 当前页
  rowTotal: null, // 总条数
})

const tableListData = computed(()=>{
    // console.log([...tableData.value.slice(
    //     (filter.value.pageNum - 1) * filter.value.pageSize,
    //     filter.value.pageNum * filter.value.pageSize
    //     )]);

return {
    selection: false, // 是否显示选择框
    columnFunctionsWidth: 220, // 操作栏宽度
    tableData: [
        ...tableData.value.slice(
        (filter.value.pageNum - 1) * filter.value.pageSize,
        filter.value.pageNum * filter.value.pageSize
        )
    ],

    tableKeys: [
        // 表格标签
        {
        id: 'code',
        label: '区域编码'
        },
        {
        id: 'regionName',
        label: '区域名称',
        allways: true
        },
        {
        id: 'parentregionName',
        label: '上级区域'
        },
        {
        id: 'regionDesc',
        label: '区域描述'
        }
    ],
    tableFunctions: authTableFunctions.value
}
})

onMounted(()=>{
    allTableFunction.value = [
      // 操作栏
      {
        id: '100019',
        label: '编辑',
        method: handleEditRegion
      },
      {
        id: '100020',
        label: '删除',
        method: handleRemoveRegion
      }
    ],
    authTableFunctions.value = getAuthTableFunctions(allTableFunction.value)
    getTrees('')
})


// 部门信息弹窗是否显示
const dialogVisible = ref(false)
// 当前弹窗处于什么模式 edit编辑 add添加
const dialogMode = ref('add')
// 部门信息表单
const form = ref<Recordable>({
    id: '',
    regionName: '',
    regionDesc: '',
    parentDepartmentId: null,
    parentregionName: null,
    location: []
})

// 编辑部门
const handleEditRegion = (scope:any) => {
    dialogVisible.value = true
    dialogMode.value = 'edit'
    let row = scope.row
    form.value.id = row.id
    form.value.regionName = row.regionName
    form.value.regionDesc = row.regionDesc
    form.value.parentDepartmentId = row.parentDepartmentId
    form.value.parentregionName = row.parentregionName
    form.value.location = tableData.value[scope.$index].location.coordinates
    console.log('form.location', tableData.value,dialogVisible.value)
}
const handleMapLocation = ()=>{
  showMapLocation.value = true
}
// 设置定位数据
const setLocate = async (val:any) => {
    if (form.value.location.length) {
        await chooseLocation().then(()=>{
            (form.value.location = [val[0], val[1]]), (form.value.zoom = val[3])
        })
    }
    (form.value.location = [val[0], val[1]]), (form.value.zoom = val[3])

}

// 获取配置
const getData = async () => {
    const res = await window.$Api().PersonalPreferenceMapViewController.get_view.request();
    if (res.location.coordinates) {
    form.value = {
        location: res.location.coordinates,
        zoom: res.zoom
    }
    }
    const modeMap:any = { DEFINED: '1', DEFAULT: '2' }
    curRadio.value = modeMap[res.mode]
}

// 部门树数据
const treeData = ref<Recordable>([])

// 当前节点树数据
const currNodeData = ref<Recordable>({})



 // 默认展开的节点集
const expandedKeys = ref<Recordable>([])

// 获取部门树数据
const getTrees = async (id:string) => {
    await window.$Api()
    .AreaController.get_tree.request()
    .then((res:any) => {
        treeData.value = [res]
        if (id) {
        getSubTreeData(treeData.value[0], id)
        getTableData(currNodeData.value)
        } else {
        getTableData(treeData.value[0])
        }
        // expandedKeys.value = [currNodeData.value.id]
        for(let item of currNodeData.value.children){
        if(item.children.length===0){
            expandedKeys.value.push(item.id)
        }
    }
    })
}

// 获得表格数据
const getTableData = (data:any) => {
    currNodeData.value = data
    tableData.value = []
    getSubChildren(data)
    filter.value.rowTotal = tableData.value.length
}

// 获得当前部门子数据
const getSubTreeData = (data:any, id:string) => {
    for (let i = 0; i < data.children.length; i++) {
    let item = data.children[i]
    if (item.id === id) {
        currNodeData.value = item
    } else {
        getSubTreeData(item, id)
    }
    }
}

// 获得当前节点下的子节点数据
const getSubChildren = (data:any) => {
    data.children.forEach((item:any) => {
    tableData.value.push({
        id: item.id,
        code: item.code,
        regionName: item.name,
        regionDesc: item.description,
        parentregionName: data.name,
        parentDepartmentId: data.id,
        location: item.location
    })
    })
}

// 树节点点击
const chooseGroupNode = (data:any) => {
    filter.value.regionName = ''
    filter.value.pageNum = 1
    getTableData(data)
}


// 获得当前节点下所有子节点数据
const getAllSubChildren = (data:any) => {
    console.log('getAllSubChildren', data)
    data.children.forEach((item:any) => {
    if (item.children.length > 0) {
        tableData.value.push({
        id: item.id,
        code: item.code,
        regionName: item.name,
        regionDesc: item.description,
        parentregionName: name + data.name,
        parentDepartmentId: data.id
        })
        getAllSubChildren(item)
    } else {
        tableData.value.push({
        id: item.id,
        code: item.code,
        regionName: item.name,
        regionDesc: item.description,
        parentregionName: data.name,
        parentDepartmentId: data.id
        })
    }
    })
}

const dpForm = ref<Recordable>({})

// 重置部门信息表单
const resetForm = () => {
    form.value.id = ''
    form.value.regionName = ''
    form.value.regionDesc = ''
    form.value.parentDepartmentId = ''
    form.value.parentregionName = ''
    form.value.location = []
    dpForm.value.clearValidate()
    dialogVisible.value = false
}

// 添加部门
const handleAddRegion = () => {
    dialogVisible.value = true
    dialogMode.value = 'add'

    form.value.parentregionName = currNodeData.value.name
    form.value.parentDepartmentId = currNodeData.value.id
}

// 编辑当前父部门
const handleEditCurrRegion = (node:any, data:any) => {
    dialogVisible.value = true
    dialogMode.value = 'edit'
    // 将部门信息赋值给弹窗表单
    node.parent.data.id
    ? (form.value.parentDepartmentId = node.parent.data.id)
    : (form.value.parentDepartmentId = null)
    node.parent.data.name
    ? (form.value.parentregionName = node.parent.data.name)
    : (form.value.parentregionName = '部门')
    form.value.regionName = data.name
    form.value.regionDesc = data.description
    form.value.id = data.id
    form.value.location = data.location.coordinates
}

// 保存部门信息
const handleSave = async () => {
    // if (this.form.location[0] === null || this.form.location[1] === null) {
    //   window.parent.frameEvent({
    //     type: "message",
    //     msg: "请选择中心位置",
    //     showType: "error",
    //   });
    //   return;
    // }
    console.log(dpForm.value);

    dpForm.value.validate((valid:any) => {
        console.log(form.value);

    // 表单校验失败则退出
    if (valid === false) {
        return false
    }

    console.log(dialogMode.value);


    if (dialogMode.value === 'add') {
        new window.$Api().AreaController.post_area
        .request({
            data: {
            name: form.value.regionName,
            description: form.value.regionDesc,
            location: {
                coordinates: form.value.location
            },
            parent: {
                id: form.value.parentDepartmentId
            }
            }
        })
        .then((res:any) => {
            getTrees(currNodeData.value.id)
            resetForm()
            dialogVisible.value = false
        })
    }

    if (dialogMode.value === 'edit') {
        new window.$Api().AreaController.put_area
        .request({
            path: {
            id: form.value.id
            },
            data: {
            name: form.value.regionName,
            description: form.value.regionDesc,
            location: {
                coordinates: form.value.location
            }
            }
        })
        .then((res:any) => {
            getTrees(currNodeData.value.id)
            resetForm()
            dialogVisible.value = false
        })
    }
    })
}

// 树删除
const handleRemoveRegion = (...data:any) => {
    let id = data.length === 2 ? data[1].id : data[0].row.id
    delText('区域及下属区域').then(() => {
    new window.$Api().AreaController.delete_area
        .request({
        path: {
            id
        }
        })
        .then((res:any) => {
        getTrees(
            data.length === 2 ? data[0].parent.data.id : currNodeData.value.id
        )
        dialogVisible.value = false
        })
    })
}

// 搜索触发事件
const search = () => {
    getTableData(currNodeData.value)
    filter.value.pageNum = 1
    tableData.value = tableData.value.filter((item:any) => {
    return ~item.regionName.indexOf(filter.value.regionName)
    })
    filter.value.rowTotal = tableData.value.length
}
// 重置触发事件
const resetSearch = () => {
    filter.value.regionName = ''
    getTableData(currNodeData.value)
}
// 当前页数改变时触发
const currentChange = (val:any) => {
    filter.value.pageNum = val
}
// 取消
const handleCancel = () => {
    resetForm()
}

// 每页条数改变数触发
const sizeChange = (val:any) => {
    filter.value.pageSize = val
}
const checkLngLat = (rule:any, value:any, callback:any) => {
    if (
    !form.value.location.length ||
    form.value.location[0] === null ||
    form.value.location[1] === null
    ) {
    callback(new Error('请选择中心位置'))
    }
    callback()
}

const descDict = ref<Recordable>( {
        title: { add: '添加区域', edit: '编辑区域信息' }
      })

const formLabelWidth = ref('90px')

const curRadio = ref('')

// 部门表单校验
const dpRules = ref({
        regionName: [
          {
            required: true,
            message: '请输入长度为2-20的区域名称',
            trigger: 'blur'
          },
          { validator: validateRule.validFullName, trigger: 'blur' }
        ],
        regionDesc: [
          {
            required: false,
            message: '请输入长度为3到140个字符的区域描述',
            trigger: 'blur'
          },
          { min: 3, max: 140, message: '长度在3到140个字符', trigger: 'blur' }
        ],
        lnglat: [{ required: true, validator: checkLngLat }]
      })

</script>

<style lang="scss" scoped>
.area {
  height: 100%;
  padding: 24px;
  display: flex;
  .area-sub {
    padding: 20px 10px;
    border-right: none;
    border-radius: 5px;
  }
  .area-main {
    padding: 0;
    margin: 0 0 0 24px;
    border-radius: 5px;
    // :deep(.table-page .content) {
    //   padding: 0;
    // }
    .area-main-desc {
      margin: 24px 24px 10px;
      padding: 0 6px 12px 6px;
      border: 1px solid #ddd;

      p {
        font-size: 14px;
        padding: 4px;
      }
    }
  }
}
.form-textarea {
  margin-left: 90px;
}
.center-position{
  align-items: baseline;
}
</style>
<style>
.center-position .el-form-item__label {
  width: 90px;
}
.center-position .el-form-item__label::before {
  content: '* ';
  color: red;
}

.location-des {
    color: rgb(12, 16, 20);
    font-size: 14px;
    word-break: break-all;
    margin: 8px 32px 8px 0;
}
.plain-button:hover {
    background-color:  "#345ef0";
}
</style>
