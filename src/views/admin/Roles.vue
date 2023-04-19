<template>
  <div>
    <table-page
      pageName="角色管理"
      :layout="['search','keyFilter','selectAllBtn','selectionCount','pagination']"
      :data="tableListData"
      :filter="filter"
      @search="filterRolesList"
      @resetSearch="resetfilterRolesList"
      @tableSelectionChange="tableSelectionChange"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      @setTableKeys="tablePageJs.setTableKeys"
      @selectAll="tablePageJs.tableSelectAllStatus"
      ref="table"
      id="roles"
    >
      <!-- 搜索栏 -->
      <template v-slot:searchFilter>
        <el-form :inline="true" :model="filter" class="demo-form-inline" label-width="100px" @submit.native="$event.preventDefault();search()">
          <el-form-item label="角色名称">
            <el-input v-model="filter.name" placeholder="请输入角色名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </template>

      <!-- 控制栏 -->
      <template v-slot:controller>
        <el-button type="primary" @click="handleAddRole" v-if="has('100008')">
            <el-icon color="#fff" style="margin:0 4px;"><Plus /></el-icon>添加角色</el-button>
        <el-button  @click="handleRemoveRoles" v-if="has('100010')">
            <el-icon color="gray" style="margin:0 4px;"><Delete /></el-icon>删除角色</el-button>
      </template>
    </table-page>

    <!--编辑角色基本信息-->
    <el-dialog :title="descDict.title[baseDialogMode]" v-model="baseDialogVisible" :append-to-body="true" :close-on-click-modal="false" width="640px" @close="resetUserInfo">
      <el-form :model="baseForm" :rules="roleRules" ref="baseFormRef"  style="margin-right: 102px;">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="baseForm.name" :placeholder="roleRules.name[0].message"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="baseForm.description" :placeholder="roleRules.description[0].message"></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer class="dialog-footer">
        <el-button @click="handleCancelBase" size="small">取消</el-button>
        <el-button type="primary" @click="handleSaveBase" size="small">保存</el-button>
      </template>
    </el-dialog>

    <!--配置角色表单 -->
    <el-dialog
      class="permissionTable"
      :title="descDict.title[baseDialogMode]"
      v-model="permissionsDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="800px"
      @close="resetPermissionsTable"
    >
      <permission-setting-box ref="permissionsSettingBox" :menus="permissionsList" v-if="permissionsList.menus" @close="resetPermissionsTable" :key="permissionsList.roleId" @updateMenus="getMenus" />
    </el-dialog>

    <!-- 查看用户表格 -->
    <el-dialog :title="descDict.title[baseDialogMode]" v-model="usersDialogVisible" :append-to-body="true" :close-on-click-modal="false" width="640px" @close="resetUsersTable" class="infoTable">
        <el-table :data="usersList" style="width: 100%" height="500">
        <el-table-column label="序号">
          <template v-slot="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="loginName" label="登陆账号"></el-table-column>
        <el-table-column prop="status" label="账号状态"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { validateRule } from '@/utils/global'
import PermissionSettingBox from './PermissionSettingBox.vue'
import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { delText, selectText } from '@/utils/suggestiveText.ts'

import TablePage from '@/gitsubmodule/tablePage/TablePage/TablePage.vue'
import tablePageJs from '@/gitsubmodule/tablePage/TablePage/TablePage.js'
import { watch, onMounted, ref, computed } from 'vue'

const rolesListData = ref<Recordable>([])

const tableListData = computed<Recordable>(()=>{
    return {
        selection: true,
        selectable: (row:any) => {
          if (row.isAdmin) {
            return false
          }
          if (row.systemDefault) {
            return false
          }
          return true
        }, // 是否显示选择框
        tableData: rolesListData.value,
        columnFunctionsWidth: 350, // 操作栏宽度
        tableKeys: [
          {
            id: 'name',
            label: '角色名称',
            allways: true
          },
          {
            id: 'description',
            label: '描述'
          }
        ],
        tableFunctions: authTableFunctions.value
      }
})

// 角色基本信息
const baseForm = ref<Recordable>({
id: '',
name: '',
description: ''
})

// 获取角色详情详情
const getRole = (id:string) => {
    window.$Api()
    .RoleController.get_role.request({
        path: {
        id
        }
    })
    .then((res:any) => {
        baseForm.value = res
    })
}

// 当前角色基本信息弹窗模式 add添加 edit修改
const baseDialogMode = ref('edit')
// 基本信息弹窗是否显示
const baseDialogVisible = ref(false)

// 编辑角色
const handleEditRole = (scope:any) => {
    getRole(scope.row.id)

    baseDialogMode.value = 'edit'
    baseDialogVisible.value = true
}
// 取消编辑基本信息
const handleCancelBase = () => {
    baseDialogVisible.value = false
}

const filter = ref<Recordable>({
name: '',
pageSize: 10, // 每页条数
pageNum: 1, // 当前页
rowTotal: null // 总条数
})


// 获取角色列表数据
const getGridData = () => {
    let filterObject:any = {
        condition:{
            name:''
        }
    }
    if (filter.value.name) {
        filterObject.condition = {}
        filterObject.condition.name = filter.value.name
    } else {
        filterObject = {
        page: filter.value.pageNum,
        pageSize: filter.value.pageSize
    }
    }
    window.$Api()
    .RoleController.post_pageList.request({
        data: filterObject,
        headers: {
        hideNotify: true
        }
    })
    .then((res:any) => {
        rolesListData.value = res.data
        filter.value.rowTotal = res.total
    })
}

const baseFormRef = ref()

// 保存角色基本信息
const handleSaveBase = () => {
    baseFormRef.value.validate((valid:boolean) => {
    // 表单校验失败则退出
    if (valid === false) {
        return false
    }

    if (baseDialogMode.value === 'add') {
        window.$Api()
        .RoleController.post_role.request({
            data: baseForm.value
        })
        .then((res:any) => {
            baseDialogVisible.value = false
            getGridData()
        })
    }
    if (baseDialogMode.value === 'edit') {
        window.$Api()
        .RoleController.put_role.request({
            data: baseForm.value,
            path: {
            id: baseForm.value.id
            }
        })
        .then((res) => {
            baseDialogVisible.value = false
            // 更新列表
            getGridData()
        })
    }
    })
}

// 禁用功能
const isDisabled = (scope:any) => {
    let row = scope.row
    if (row.isAdmin) {
    return true
    }
    if (row.systemDefault) {
    return true
    }
    return false
}

// 删除角色
const handleRemoveRole = (scope:any) => {
    delText('角色').then(() => {
    window.$Api()
        .RoleController.delete_role.request({
        path: {
            ids: scope.row.id
        }
        })
        .then((res:any) => {
            getGridData()
        })
    })
}

// 配置功能权限弹窗是否展示
const permissionsDialogVisible = ref(false)

// 当前角色权限列表
const permissionsList = ref<Recordable>([])

// 配置功能权限
const handleEditGurisdiction = (scope:any) => {
    baseDialogMode.value = 'setPermission'
    // 获取权限列表
    window.$Api()
    .RoleController.get_funcs.request({
        path: {
        roleId: scope.row.id
        },
        params: {
        appName: 'pc' // appName：null，表示所有，appName：pc, pc独有，applet 代表移动端独有
        }
    })
    .then((res:any) => {
        permissionsList.value = res
        permissionsDialogVisible.value = true
    })
}

// 查看用户弹窗是否显示
const usersDialogVisible = ref(false)

// 当前角色表格列表
const usersList = ref<Recordable>([])

// 查看用户列表
const handleCheckUsers = (scope:any) => {
    baseDialogMode.value = 'seeUser'
    usersDialogVisible.value = true
    // 获取角色当前的用户
    window.$Api()
    .RoleController.get_users.request({
        path: {
        roleId: scope.row.id
        },
        headers: {
        hideNotify: true
        }
    })
    .then((res:any) => {
        usersList.value = res
    })
}

const allTableFunction = ref<Recordable>([
      // 操作栏
      {
        id: '100009',
        label: '编辑',
        method: handleEditRole,
        disabled: isDisabled
      },
      {
        id: '100010',
        label: '删除',
        method: handleRemoveRole,
        disabled: isDisabled
      },
      {
        id: '100013',
        label: '配置功能权限',
        method: handleEditGurisdiction,
        disabled: isDisabled
      },
      {
        id: '100012',
        label: '查看用户',
        method: handleCheckUsers
      }
    ])

onMounted(()=>{
    authTableFunctions.value = getAuthTableFunctions(allTableFunction.value)
    getGridData()
})

// 重置角色信息弹窗
const resetUserInfo = () => {
    // 基本信息
    baseForm.value = {
    id: '',
    name: '',
    description: ''
    }
    baseFormRef.value.clearValidate()
}
// 搜索角色
const filterRolesList = () => {
    filter.value.pageNum = 1
    getGridData()
}
// 重置搜索
const resetfilterRolesList = () => {
    filter.value.name = ''
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

// 已选的角色信息ids
const selectedRowIds = ref<Recordable>([])

// 批量删除角色
const handleRemoveRoles = () => {
    if (selectedRowIds.value.length <= 0) {
    return selectText('角色')
    }

    delText('角色').then(() => {
    window.$Api()
        .RoleController.delete_role.request({
        path: {
            ids: selectedRowIds.value.join(',')
        }
        })
        .then((res:any) => {
        getGridData()
        })
    })
}
// 添加角色
const handleAddRole = () => {
    baseDialogVisible.value = true
    baseDialogMode.value = 'add'
}


// 每次有表格行被选状态改变时，记录被选行id
const tableSelectionChange = (rows:any) => {
    selectedRowIds.value = []
    rows.forEach((item:any) => {
    selectedRowIds.value.push(item.id)
    })
}

// 配置角色弹出是否显示
const roleDialogVisible = ref(false)

// 取消配置角色
const resetUsersTable = () => {
    roleDialogVisible.value = false
    usersList.value = []
}

const getMenus = (e:any) => {
    // 获取权限列表
    window.$Api()
    .RoleController.get_funcs.request({
        path: {
        roleId: permissionsList.value.roleId
        },
        params: {
        roleId: permissionsList.value.roleId,
        appName: e // appName：null，表示所有，appName：pc, pc独有，applet 代表移动端独有
        }
    })
    .then((res:any) => {
        permissionsList.value = res
    })
}

// 取消配置功能权限
const resetPermissionsTable = () => {
    permissionsDialogVisible.value = false
    permissionsList.value = []
}

const descDict = ref<Recordable>({
title: {
    add: '添加角色',
    edit: '编辑角色',
    seeUser: '查看用户',
    setPermission: '配置功能权限'
}
})

const formLabelWidth = ref('100px')

// 角色表单校验
const roleRules = ref<Recordable>({
name: [
    {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
    }
    // { validator: validateRule.validFullName, trigger: 'blur' }
],
description: [
    { required: false, message: '请输入角色描述', trigger: 'blur' }
]
})

</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
.infoTable :deep(.el-dialog__body)  {
  padding: 0 20px;
}
.permissionTable :deep(.el-dialog__body) {
  padding: 20px;
}
</style>
