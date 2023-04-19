<template>
  <div style="position: relative" class="area">
    <div class="area-sub background-white">
      <group-tree-box
        @chooseGroupNode="chooseGroupNode"
        ref="treebox"
        @update="handleEditCurrDepartment"
        @delete="handleRemoveDepartment"
        :treeData="treeData"
        :expandedKeys="expandedKeys"
        :authIds="{ updateId: '100016', deleteId: '100017' }"
      />
    </div>
    <div class="area-main background-white">
      <div class="area-main-desc">
        <div class="area-main-head" style="font-weight: bold">
          <h4>当前部门信息</h4>
        </div>
        <p>部门名称: {{ currNodeData.name }}</p>
        <p>部门简称: {{ currNodeData.shortName }}</p>
        <p>部门描述: {{ currNodeData.description }}</p>
      </div>
      <div class="area-table">
        <table-page
          :data="tableListData"
          pageName="部门管理"
          :layout="['search','keyFilter','selectAllBtn','selectionCount','pagination']"
          :filter="filter"
          @search="search"
          @resetSearch="resetSearch"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          ref="table"
          id="organization"
          @setTableKeys="tablePageJs.setTableKeys"
          @selectAll="tablePageJs.tableSelectAllStatus"
        >
          <template v-slot:info>
            <div
              class="area-main-head"
              style="
                padding: 10px 0;
                margin: -20px 0px 10px -10px;
                font-weight: bold;
              "
            >
              <h4>下属部门</h4>
            </div>
          </template>
          <!-- 搜索栏 -->
          <template v-slot:searchFilter>
            <el-form
              :inline="true"
              :model="filter"
              class="demo-form-inline"
              label-width="100px"
              @submit.native="
                $event.preventDefault();
                search();
              "
            >
              <el-form-item label="部门名称">
                <el-input
                  v-model="filter.departmentName"
                  placeholder="请输入部门名称"
                  clearable
                ></el-input>
                <!-- <input v-show="false"/> -->
              </el-form-item>
            </el-form>
          </template>
          <!-- 控制栏 -->

          <template v-slot:controller>
            <el-button
              type="primary"
              @click="handleAddDepartment"
              v-if="has('100015')"
              size="small"
            >
              <el-icon color="#fff" style="margin: 0 4px"><Plus /></el-icon
              >添加部门</el-button
            >
          </template>
        </table-page>
      </div>
    </div>

    <!--部门表单-->
    <el-dialog
      :title="descDict.title[dialogMode]"
      v-model="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px"
      @close="resetForm"
    >
      <el-form
        :model="form"
        ref="dpForm"
        :rules="dpRules"
        style="margin-right: 102px"
      >
        <el-form-item
          label="部门名称"
          prop="departmentName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.departmentName"
            :placeholder="dpRules.departmentName[0].message"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上级部门"
          prop="parentDepartmentId"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.parentDepartmentName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="部门简称"
          prop="departmentSimpleName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.departmentSimpleName"
            :placeholder="dpRules.departmentSimpleName[0].message"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="部门描述"
          prop="departmentDesc"
          :label-width="formLabelWidth"
        >
          <el-input
            type="textarea"
            v-model="form.departmentDesc"
            :placeholder="dpRules.departmentDesc[0].message"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer class="dialog-footer">
        <el-button @click="handleCancel" size="small">取消</el-button>
        <el-button type="primary" @click="handleSave" size="small"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { validateRule } from '@/utils/global'
import GroupTreeBox from '@/components/GroupTreeBox/index.vue'

import { delText } from '@/utils/suggestiveText.ts'
import TablePage from '@/gitsubmodule/tablePage/TablePage/TablePage.vue'
import tablePageJs from '@/gitsubmodule/tablePage/TablePage/TablePage.js'
import '@/assets/system.scss'

//  表格查询条件，继承公共的接口filterPage
interface filterResource extends filterPage{
    departmentName: string
}


let treeData = ref<Recordable>([])
let currNodeData = ref<Recordable>({})
let expandedKeys = ref<Recordable>([])

// 获取部门树数据
const getTrees = async(id:String) => {
    await $Api()
    .DepartmentController.get_tree.request()
    .then((res:object) => {
    treeData.value = [res]
    if (id) {
        getSubTreeData(treeData.value[0], id)
        getTableData(currNodeData.value as [])
    } else {
        getTableData(treeData.value[0])
    }
    console.log(currNodeData.value);

    for(let item of currNodeData.value.children){
        if(item.children.length===0){
            expandedKeys.value.push(item.id)
        }
    }

    })
}

const tableData = ref<Recordable>([])

// 获得表格数据
const getTableData = (data:any) => {
  currNodeData.value = data
  tableData.value = []
  getSubChildren(data)
  filter.value.rowTotal = tableData.value.length
}

// 获得当前节点下的子节点数据
const getSubChildren = (data:Recordable) => {
  data.children.forEach((item:Recordable) => {
      tableData.value.push({
      id: item.id,
      code: item.code,
      departmentName: item.name,
      departmentSimpleName: item.shortName,
      departmentDesc: item.description,
      parentDepartmentName: data.name,
      parentDepartmentId: data.id
    })
  })

// this.tableData.reverse()
}

// 获得当前部门子数据
const getSubTreeData = (data:Recordable, id:String) => {
  for (let i = 0; i < data.children.length; i++) {
      let item = data.children[i]
      if (item.id === id) {
      currNodeData = item
      } else {
      getSubTreeData(item, id)
      }
  }
}

const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = ref<Recordable>({})

      // 编辑部门  对象属性
const handleEditDepartment = (scope:any) => {
  dialogVisible.value = true
  dialogMode.value = 'edit'
  let row = scope.row
  form.value.id = row.id
  form.value.departmentName = row.departmentName
  form.value.departmentSimpleName = row.departmentSimpleName
  form.value.departmentDesc = row.departmentDesc
  form.value.parentDepartmentId = row.parentDepartmentId
  form.value.parentDepartmentName = row.parentDepartmentName
}

        // 树删除
const handleRemoveDepartment  = (...data:any) => {
// 参数为2时是树删除，参数为1是表格删除
let id = data.length === 2 ? data[1].id : data[0].row.id
delText('部门及下属部门').then(() => {
  $Api().DepartmentController.delete_department
    .request({
        path: {
        id
        }
    })
    .then(() => {
        getTrees(
        data.length === 2 ? data[0].parent.data.id : currNodeData.value.id
        )
        dialogVisible.value = false
    })
})
}


const allTableFunction = ref<Recordable[]>([
    {
      id: '100016',
      label: '编辑',
      method: handleEditDepartment
    },
    {
      id: '100017',
      label: '删除',
      method: handleRemoveDepartment
    }
])
const tableListData = computed<tablePageData>(()=>{
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
        label: '部门编码'
      },
      {
        id: 'departmentName',
        label: '部门名称',
        allways: true
      },
      {
        id: 'parentDepartmentName',
        label: '上级部门'
      },
      {
        id: 'departmentSimpleName',
        label: '部门简称'
      },
      {
        id: 'departmentDesc',
        label: '部门描述'
      }
    ],
    tableFunctions: authTableFunctions.value
  }
})
// ref<tablePageData>()

onMounted(()=>{
    authTableFunctions.value = getAuthTableFunctions(allTableFunction.value)
  getTrees('')
})



const filter = ref<filterResource>({
  pageSize: 10, // 每页条数
  pageNum: 1, // 当前页
  rowTotal: null, // 总条数
  departmentName: '',
  ...tablePageJs.filter
})
const descDict = ref<Recordable>({
  title: { add: '添加部门', edit: '编辑部门信息' }
})


// 树节点点击
const chooseGroupNode = (data:any) => {
  filter.value.departmentName = ''
  filter.value.pageNum = 1
  getTableData(data)
}

// 获得当前节点下所有子节点数据
const getAllSubChildren = (data:Recordable) => {
  data.children.forEach((item:Recordable) => {
      if (item.children.length > 0) {
        tableData.value.push({
            id: item.id,
            code: item.code,
            departmentName: item.name,
            departmentSimpleName: item.shortName,
            departmentDesc: item.description,
            parentDepartmentName: name + data.name,
            parentDepartmentId: data.id
        })
        getAllSubChildren(item)
      } else {
        tableData.value.push({
            id: item.id,
            code: item.code,
            departmentName: item.name,
            departmentSimpleName: item.shortName,
            departmentDesc: item.description,
            parentDepartmentName: data.name,
            parentDepartmentId: data.id
        })
      }
  })
}

const formLabelWidth = ref('90px')

// 部门表单校验
const dpRules = {
  departmentName: [
    {
        required: true,
        message: '请输入长度为2-20的部门名称',
        trigger: 'blur'
    },
    { validator: validateRule.validFullName, trigger: 'blur' }
    ],
    departmentSimpleName: [
    {
        required: false,
        message: '请输入长度为2-10位的部门简称（字母，或数字与字母的组合)',
        trigger: 'blur'
    },
    { min: 2, max: 20, message: '请输入2-20个字符', trigger: 'blur' }
    ],
    departmentDesc: [
    {
        required: false,
        message: '请输入长度为3到140个字符的部门描述',
        trigger: 'blur'
    },
    { min: 3, max: 140, message: '长度在3到140个字符', trigger: 'blur' }
  ]
}

const dpForm = ref<Recordable>({})
// 重置部门信息表单
const resetForm = () => {
  form.value.id = ''
  form.value.departmentName = ''
  form.value.departmentSimpleName = ''
  form.value.departmentDesc = ''
  form.value.parentDepartmentId = ''
  form.value.parentDepartmentName = ''
  dpForm.value.clearValidate()
}

// 添加部门
const handleAddDepartment = () => {
  dialogVisible.value = true
  dialogMode.value = 'add'

  form.value.parentDepartmentName = currNodeData.value.name
  form.value.parentDepartmentId = currNodeData.value.id
}

// 编辑当前父部门
const handleEditCurrDepartment = (node:any, data:any) => {
  dialogVisible.value = true
  dialogMode.value = 'edit'
  // 将部门信息赋值给弹窗表单
  node.parent.data.id
      ? (form.value.parentDepartmentId = node.parent.data.id)
      : (form.value.parentDepartmentId = null)
  node.parent.data.name
      ? (form.value.parentDepartmentName = node.parent.data.name)
      : (form.value.parentDepartmentName = '部门')
  form.value.departmentName = data.name
  form.value.departmentSimpleName = data.shortName
  form.value.departmentDesc = data.description
  form.value.id = data.id
}

// 保存部门信息
const handleSave = () => {
  dpForm.value.validate((valid:boolean) => {
      // 表单校验失败则退出
      if (valid === false) {
      return false
      }

      if (dialogMode.value === 'add') {
        $Api().DepartmentController.post_department
          .request({
          data: {
              name: form.value.departmentName,
              shortName: form.value.departmentSimpleName,
              description: form.value.departmentDesc,
              parent: {
              id: form.value.parentDepartmentId
              }
          }
          })
          .then(() => {
          getTrees(currNodeData.value.id)
          dialogVisible.value = false
          })
      }

      if (dialogMode.value === 'edit') {
        $Api().DepartmentController.put_department
          .request({
          path: {
              id: form.value.id
          },
          data: {
              name: form.value.departmentName,
              shortName: form.value.departmentSimpleName,
              description: form.value.departmentDesc
          }
          })
          .then(() => {
          getTrees(currNodeData.value.id)
          dialogVisible.value = false
          })
      }
  })
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
}


// 搜索触发事件
const search = () => {
  getTableData(currNodeData.value)
  filter.value.pageNum = 1
  tableData.value = tableData.value.filter((item:any) => {
    return ~item.departmentName.indexOf(filter.value.departmentName)
  })
  filter.value.rowTotal = tableData.value.length
}

// 重置触发事件
const resetSearch = () => {
  filter.value.departmentName = ''
  getTableData(currNodeData.value)
}

// 每页条数改变数触发
const sizeChange = (val:number) => {
  filter.value.pageSize = val
}

// 当前页数改变时触发
const currentChange = (val:number) =>{
  filter.value.pageNum = val
}



</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
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

</style>
