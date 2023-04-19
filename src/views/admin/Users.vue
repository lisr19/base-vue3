<template>
    <div class="content">
      <table-page
        pageName="用户管理"
        :layout="['search','keyFilter','selectAllBtn','selectionCount','pagination']"
        :data="tableListData"
        :filter="filter"
        @search="filterUsersList"
        @resetSearch="resetfilterUsersList"
        @tableSelectionChange="tableSelectionChange"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        @setTableKeys="tablePageJs.setTableKeys"
        @selectAll="tablePageJs.tableSelectAllStatus"
        ref="table"
        id="users"
      >
        <!-- 搜索栏 -->
        <template v-slot:searchFilter>
          <el-form :inline="true" :model="filter" class="demo-form-inline" label-width="100px">
            <el-form-item label="账号">
              <el-input size="default" v-model="filter.loginName" placeholder="请输入账号" clearable></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input size="default" v-model="filter.name" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="部门" v-if="treeData.length">
              <select-group-tree  :options="treeData" @getValue="getfilterDepartment($event)" :valueModel="filter.department.name"/>
            </el-form-item>
          </el-form>
        </template>

        <!-- 自定义表格栏 -->
        <!-- 状态栏 -->
        <template v-slot:column_status="row">
          <el-button class="status-btn" :type="row.data.status === '正常' ? 'primary' : 'info'" plain>{{ row.data.status }}</el-button>
        </template>

        <!-- 有效期栏 -->
        <template v-slot:column_expiredTime="row">{{ row.data.expiredTime ? row.data.expiredTime : '无期限' }}</template>

        <!-- 控制栏 -->
        <template v-slot:controller>
          <el-button type="primary" size="small" @click="handleAddUser" v-if="has('100001')">
            <el-icon color="#fff" style="margin:0 4px;"><Plus /></el-icon>添加用户</el-button>
          <el-button size="small" @click="handleRemoveUser" v-if="has('100002')">
            <el-icon color="gray" style="margin:0 4px;"><Delete /></el-icon>删除用户</el-button>
        </template>
      </table-page>

      <!--编辑用户基本信息-->
      <el-dialog :title="descDict.title[baseDialogMode]" v-model="baseDialogVisible" :append-to-body="true" :close-on-click-modal="false" width="600px" @close="resetUserInfo">
        <el-form :model="baseForm" :rules="roleRules" ref="baseFormRef" style="margin-right: 102px;">
          <el-form-item label="账号" :label-width="formLabelWidth" prop="loginName">
            <el-input v-model="baseForm.loginName" :placeholder="roleRules.loginName[0].message"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="baseForm.name" :placeholder="roleRules.name[0].message"></el-input>
          </el-form-item>
          <el-form-item label="初始密码" :label-width="formLabelWidth" prop="initPassword" v-if="baseDialogMode === 'add'">
            <el-input v-model="baseForm.initPassword" :placeholder="roleRules.initPassword[0].message" show-password></el-input>
          </el-form-item>
          <el-form-item label="批量操作密码" :label-width="formLabelWidth" prop="batchOptPassword" v-if="baseDialogMode === 'add'">
            <el-input v-model="baseForm.batchOptPassword" :placeholder="roleRules.batchOptPassword[0].message" show-password></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phoneNumber">
            <el-input v-model="baseForm.phoneNumber" :placeholder="roleRules.phoneNumber[0].message"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="baseForm.email" :placeholder="roleRules.email[0].message"></el-input>
          </el-form-item>
          <el-form-item label="用户状态" :label-width="formLabelWidth" prop="enabled">
            <el-radio-group v-model="baseForm.enabled">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账户有效期" :label-width="formLabelWidth" prop="expiredTime">
            <el-date-picker v-model="baseForm.expiredTime" type="datetime" placeholder="选择日期" style="width:100%;height: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="部门" :label-width="formLabelWidth" prop="department">
            <select-group-tree :options="treeData" @getValue="getDepartment($event)" :valueModel="baseForm.department.name" v-if="selectGroupTreeVisible" />
          </el-form-item>
          <el-form-item label="是否部门主管" :label-width="formLabelWidth" prop="departmentManager">
            <el-radio-group v-model="baseForm.departmentManager">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <template v-slot:footer class="dialog-footer">
          <el-button @click="handleCancelBase" size="small">取消</el-button>
          <el-button type="primary" @click="handleSaveBase" size="small">保存</el-button>
        </template>
      </el-dialog>

      <!--配置角色表单 -->
      <el-dialog :title="descDict.title[baseDialogMode]" v-model="roleDialogVisible" :append-to-body="true" :close-on-click-modal="false" width="800px" @close="handleCancelGurisdiction">
        <role-setting-box @handleSaveSetting="handleSaveGurisdictions" :checkeds="checkGurisdictions" :array="jurisdictions" :message="jurisdictionsMessage" v-if="roleDialogVisible" />
      </el-dialog>

      <!-- 重置密码表单 -->
      <el-dialog :title="descDict.title[baseDialogMode]" v-model="pwdDialogVisible" :append-to-body="true" :close-on-click-modal="false" width="500px" @close="resetPwdForm">
        <el-form :model="baseForm" :rules="roleRules" label-width="120px" ref="pwdForm" @submit.native.prevent>
          <el-form-item label="用户登录密码" prop="initPassword" v-if="baseDialogMode === 'reset'">
            <el-input v-model="baseForm.initPassword" placeholder="请输入新的密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="批量操作密码" prop="batchOptPassword" v-if="baseDialogMode === 'resetBatchOptPwd'">
            <el-input v-model="baseForm.batchOptPassword" placeholder="请输入新的密码" show-password></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer class="dialog-footer">
          <el-button @click="pwdDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="handleSavePwd">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>

  <script lang="ts" setup>
import TablePage from '@/gitsubmodule/tablePage/TablePage/TablePage.vue'
import tablePageJs from '@/gitsubmodule/tablePage/TablePage/TablePage.js'

import SelectGroupTree from '@/components/SelectGroupTree/index'
  import RoleSettingBox from './RoleSettingBox'
  import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'

  import { delText, selectText } from '@/utils/suggestiveText.ts'
  // const { formatDate, validateRule } = window.imports.global
  import { formatDate, validateRule } from '@/utils/global'
  import { watch, onMounted, ref, computed } from 'vue'


const usersListData = ref<Recordable>([])


const tableListData = computed<Recordable>(()=>{
    return {
          selection: true, // 是否显示选择框
          tableData: usersListData.value,
          columnFunctionsWidth: 350, // 操作栏宽度
          // 列是否可选
          selectable: (row:any) => {
            if (!row.createByAdmin) {
              return true
            }
            return false
          },
          tableKeys: [
            // 表格标签
            {
              id: 'loginName',
              label: '账号',
              allways: true
            },
            {
              id: 'name',
              label: '姓名',
              allways: true
            },
            {
              id: 'phoneNumber',
              label: '手机号码'
            },
            {
              id: 'email',
              label: '邮箱'
            },
            {
              id: 'department',
              label: '部门',
              formatter: (row) => {
                return row.department ? row.department.name : '-'
              }
            },
            {
              id: 'departmentManager',
              label: '是否为主管',
              formatter: (row) => {
                return row.departmentManager ? '是' : '否'
              }
            },
            {
              id: 'expiredTime',
              label: '有效期'
            },
            {
              id: 'status',
              label: '状态'
            }
          ],
          tableFunctions: authTableFunctions.value
        }
})

// 编辑用户
const handleEditUser = (scope:any) => {
selectGroupTreeVisible.value = false
getUser(scope.row.id)

baseDialogMode.value = 'edit'
baseDialogVisible.value = true
}

// 配置角色
const handleEditRole = (scope:any) => {
window.$Api()
    .TenantUserController.get_roles.request({
    path: {
        userid: scope.row.id
    }
    })
    .then((res:any) => {
    jurisdictionsMessage.value =
        '当前无角色分组，请到系统管理->角色管理添加角色分组'
    let data:any = []
    let checks:any = []
    res.forEach((item:any) => {
        data.push({
        id: item.roleId,
        name: item.roleName
        })

        if (item.enable) {
        checks.push(item.roleId)
        }
    })
    currentID.value = scope.row.id
    jurisdictions.value = data
    checkGurisdictions.value = checks
    baseDialogMode.value = 'editRole'
    roleDialogVisible.value = true
    })
}

// 禁用功能
const isDisabled = (scope:any) => {
let row = scope.row
if (row.createByAdmin) {
    return true
}
return false
}

// 配置数据权限
const handleEditGurisdiction = (scope:any) => {
window.$Api()
    .TenantUserController.get_permissions.request({
    path: {
        userid: scope.row.id
    }
    })
    .then((res:any) => {
    jurisdictionsMessage.value =
        '当前无数据权限分组，请到系统管理->数据权限管理添加数据权限分组'
    let data:any = []
    let checks:any = []
    res.forEach((item:any) => {
        data.push({
        id: item.permissionId,
        name: item.permissionName
        })

        if (item.enable) {
        checks.push(item.permissionId)
        }
    })
    currentID.value = scope.row.id
    jurisdictions.value = data
    checkGurisdictions.value = checks
    baseDialogMode.value = 'editJurisdiction'
    roleDialogVisible.value = true
    })
}

// 重置密码
const handleEditPwd = (scope:any) =>{
baseDialogMode.value = 'reset'
pwdDialogVisible.value = true
currUserInfo.value = scope.row
}

// 重置批量操作密码
const handleEditBatchOptPwd = (scope:any) => {
baseDialogMode.value = 'resetBatchOptPwd'
pwdDialogVisible.value = true
currUserInfo.value = scope.row
}

const allTableFunction = ref<Recordable>([
     // 操作栏
     {
        id: '100004',
        label: '编辑',
        method: handleEditUser
    },
    {
        id: '100006',
        label: '配置角色',
        method: handleEditRole,
        disabled: isDisabled
    },
    {
        id: '100007',
        label: '配置数据权限',
        method: handleEditGurisdiction,
        disabled: isDisabled
    },
    {
        id: '100005',
        label: '重置密码',
        method: handleEditPwd
    },
    {
        id: '100413',
        label: '重置批量操作密码',
        method: handleEditBatchOptPwd
    }
])

// 下拉树形组件是否显示
const selectGroupTreeVisible = ref(false)

// 当前用户基本信息弹窗模式 add添加 edit修改
const baseDialogMode = ref('add')

// 基本信息弹窗是否显示
const baseDialogVisible = ref(false)



const filter = ref<Recordable>({
    loginName: '',
    name: '',
    department: {
    code: '',
    name: ''
    },
    pageSize: 10, // 每页条数
    pageNum: 1, // 当前页
    rowTotal: null // 总条数
})


onMounted(()=>{
      authTableFunctions.value = getAuthTableFunctions(allTableFunction.value)
      getGridData()
      getTrees('')
})

// 获取用户列表数据
const getGridData = () => {
let filterData:any = {
    pageNum: filter.value.pageNum,
    pageSize: filter.value.pageSize,
    condition: {

    }
}
if (filter.value.name || filter.value.loginName || filter.value.department.code) {
    if (!filterData.condition) {
        filter.condition = {}
    }
    if (filter.value.name) {
        filterData.condition.name = filter.value.name
    }
    if (filter.value.loginName) {
        filterData.condition.loginName = filter.value.loginName
    }
    if (filter.value.department.code) {
        filterData.condition.department = {
        code: filter.value.department.code
    }
    }
}
window.$Api()
    .TenantUserController.post_pageList.request({
    data: filter.value,
    headers: {
        hideNotify: true
    }
    })
    .then((res:any) => {
    usersListData.value = res.data
    // 格式化修改时间
    usersListData.value.forEach((item:any) => {
        if (item.expiredTime) {
        item.expiredTime = formatDate(new Date(item.expiredTime), 'Y-M-D h:i:s')
        }
    })

    filter.value.rowTotal = res.total

    })

}

const treeData = ref<Recordable>([])
// 获得部门结构树
const getTrees = (id:string) => {
window.$Api()
    .DepartmentController.get_tree.request()
    .then((res:any) => {
    treeData.value = res.children
    })
}

// 用户基本信息
const baseForm = ref<Recordable>({
    id: '',
    loginName: '',
    name: '',
    initPassword: '',
    batchOptPassword: '',
    phoneNumber: '',
    email: '',
    enabled: true,
    expiredTime: '',
    department: {
    code: '',
    name: ''
    },
    departmentManager: false
})
// 获得当前选中部门信息
const getDepartment = (node:any) => {
baseForm.value.department.code = node.code
baseForm.value.department.name = node.name
}
const getfilterDepartment = (node:any) => {
filter.value.department.code = node.code
filter.value.department.name = node.name
}

// 获取用户详情
const getUser = (id:string) => {
window.$Api()
    .TenantUserController.get_user.request({
    path: {
        id
    }
    })
    .then((res:any) => {
    baseForm.value = res
    if (!baseForm.value.department) {
        baseForm.value.department = {
        code: '',
        name: ''
        }
    }
    selectGroupTreeVisible.value = true
    })
}

const baseFormRef = ref<Recordable>({})
const pwdForm = ref<Recordable>({})

// 重置用户信息弹窗
const resetUserInfo = () => {
// 基本信息
baseForm.value = {
    id: '',
    loginName: '',
    name: '',
    initPassword: '',
    batchOptPassword: '',
    phoneNumber: '',
    email: '',
    enabled: true,
    expiredTime: '',
    department: {
    code: '',
    name: ''
    }
}
baseFormRef.value.clearValidate()
}

const currUserInfo = ref('')

const resetPwdForm = () => {
baseForm.value.initPassword = ''
currUserInfo.value = ''
pwdForm.value.clearValidate()
}

// 搜索用户
const filterUsersList = () => {
filter.value.pageNum = 1
getGridData()
}
// 重置搜索
const resetfilterUsersList = () => {
filter.value.loginName = ''
filter.value.name = ''
filter.value.department = null
filter.value.department = {
    code: '',
    name: ''
}
getGridData()
}

// 更改每页数量
const handleSizeChange = (newValue:any) => {
filter.value.pageSize = newValue
getGridData()
}


// 翻页
const handleCurrentChange = (newPageNumber:number) => {
filter.value.pageNum = newPageNumber
getGridData()
}

// 已选的用户信息ids
const selectedRowIds = ref([])

// 删除用户
const handleRemoveUser = () => {
if (selectedRowIds.value.length <= 0) {
    return selectText('用户')
}

delText('用户').then(() => {
    window.$Api()
    .TenantUserController.delete_user.request({
        path: {
        ids: selectedRowIds.value.join(',')
        }
    })
    .then((res:any) => {
        getGridData()
    })
})
}

// 添加用户
const handleAddUser = () => {
baseDialogVisible.value = true
selectGroupTreeVisible.value = true
baseDialogMode.value = 'add'
}

// 取消编辑基本信息
const handleCancelBase = () => {
baseDialogVisible.value = false
}

// 保存用户基本信息
const handleSaveBase = () => {
    baseFormRef.value.validate((valid:any) => {
    // 表单校验失败则退出
    if (valid === false) {
    return false
    }

    if (baseDialogMode.value === 'add') {
    window.$Api()
        .TenantUserController.post_user.request({
        data: baseForm.value
        })
        .then(() => {
        baseDialogVisible.value = false
        getGridData()
        })
    }
    if (baseDialogMode.value === 'edit') {
    window.$Api()
        .TenantUserController.put_user.request({
        data: baseForm.value,
        path: {
            id: baseForm.value.id
        }
        })
        .then(() => {
        baseDialogVisible.value = false
        // 更新列表
        getGridData()
        // 更新vuex
        window.$store.dispatch('user/getInfo')
        })
    }
})
}
// 每次有表格行被选状态改变时，记录被选行id
const tableSelectionChange = (rows:any) => {
selectedRowIds.value = []
rows.forEach((item:any) => {
    selectedRowIds.value.push(item.id)
})
}

// 当前选中用户id
const currentID = ref('')

// 保存权限
const handleSaveGurisdictions = (res:any) => {
if (baseDialogMode.value === 'editRole') {
    // 配置角色保存
    window.$Api()
    .TenantUserController.post_assignRoles.request({
        path: {
        userid: currentID.value
        },
        data: res
    })
    .then(() => {
        handleCancelGurisdiction()
    })
} else {
    // 配置数据权限保存保存
    window.$Api()
    .TenantUserController.post_assignPermissions.request({
        path: {
        userid: currentID.value
        },
        data: res
    })
    .then(() => {
        handleCancelGurisdiction()
    })
}
}

// 角色和配置权限复选框权限数据
const jurisdictions = ref<Recordable>([])

// 当前选中权限数据
const checkGurisdictions = ref<Recordable>([])

// 配置用户弹出是否显示
const roleDialogVisible = ref(false)

// 取消配置角色
const handleCancelGurisdiction = () => {
currentID.value = ''
jurisdictions.value = []
checkGurisdictions.value = []
roleDialogVisible.value = false
}

const jurisdictionsMessage = ref('暂无数据')







// 重置密码弹窗是否显示
const pwdDialogVisible = ref(false)


// 保存密码
const handleSavePwd = () => {
let saveApi =
    baseDialogMode.value === 'reset'
    ? window.$Api().TenantUserController.post_resetPassword
    : window.$Api().TenantUserController.put_resetBatchOptPassword
let params =
    baseDialogMode.value === 'reset'
    ? `'${baseForm.value.initPassword}'`
    : {
        batchOptPassword: baseForm.value.batchOptPassword
    }
    pwdForm.value.validate((valid:any) => {
    // 表单校验失败则退出
    if (valid === false) {
    return false
    }
    // 重置密码
    saveApi
    .request({
        path: {
        userid: currUserInfo.value.id
        },
        data: params,
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(() => {
        pwdDialogVisible.value = false
    })
})
}


// 弹窗当前Tab
const dialogActiveTab = ref('base')
const formLabelWidth = ref('110px')


// 用户表单校验
const roleRules = ref<Recordable>({
    loginName: [
    {
        required: true,
        message: '请输入长度为2-15位的账号名称(字母或数字的组合)',
        trigger: 'blur'
    },
    { validator: validateRule.validAccount, trigger: 'blur' }
    ],
    name: [
    {
        required: true,
        message: '请输入长度为2-20位的姓名(字母、中文或数字的组合)',
        trigger: 'blur'
    },
    { validator: validateRule.validFullName, trigger: 'blur' }
    ],
    initPassword: [
    {
        required: true,
        message: '6-20位大小写英文数字及标点(不含空格)，至少包含两种',
        trigger: 'blur'
    },
    { validator: validateRule.password, trigger: 'blur' }
    ],
    batchOptPassword: [
    {
        required: true,
        message: '6-20位大小写英文数字及标点(不含空格)，至少包含两种',
        trigger: 'blur'
    },
    { validator: validateRule.password, trigger: 'blur' }
    ],
    phoneNumber: [
    {
        required: true,
        message: '请输入用户绑定的手机号码',
        trigger: 'blur'
    },
    { validator: validateRule.onlyPhone, trigger: 'blur' }
    ],
    email: [
    { required: false, message: '请输入用户绑定的邮箱', trigger: 'blur' },
    { validator: validateRule.validEmail, trigger: 'blur' }
    ],
    expiredTime: [
    { required: false, message: '请选择日期', trigger: 'blur' }
    ],
    enabled: [
    { required: true, message: '请选择用户的当前状态', trigger: 'blur' }
    ],
    department: [
    { required: true, message: '请选择部门', trigger: 'blur' }
    ],
    departmentManager: [
    { required: false, message: '', trigger: 'blur' }
    ]
})


const descDict = ref<Recordable>({
title: {
add: '添加用户',
edit: '编辑用户',
editRole: '配置角色',
editJurisdiction: '配置数据权限',
reset: '重置密码',
resetBatchOptPwd: '重置批量操作密码'
}
})

// 当前部门id
const groupId = ref(1)
// 当前部门名称
const groupName = ref('')
// 自定义接口
const customFn = ref({})



  </script>

  <style lang="scss"  rel="stylesheet/scss">
  .status-btn {
    height: 22px;
    background-color: white;
    color: #345ef0;
    border-color: #345ef0;
  }
  .status-btn:hover {
    background-color:#345ef0 ;
    color: white ;

  }
  </style>
