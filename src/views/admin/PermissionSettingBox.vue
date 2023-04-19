<template>
  <div class="app-container permissions">
    <div class="btn-box">
      <el-button @click="expandAll(true)" size="small" icon="Expand">展开全部</el-button>
      <el-button @click="expandAll(false)" size="small" icon="Fold">折叠全部</el-button>
      <el-button @click="setAllChecked(true)" size="small" icon="Check">全选</el-button>
      <el-button @click="setAllChecked(false)" size="small" icon="Close">全不选</el-button>

      <div style="float: right">
        <el-input v-model="edtSearch" placeholder="输入关键字" size="small" style="width: 140px;margin-right:6px;" />

        <el-button @click="filterData" size="small" icon="Search">搜索</el-button>
        <el-button @click="clearFilter" size="small" icon="Delete">清除搜索</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="PC端" name="pc"></el-tab-pane>
      <el-tab-pane label="移动端" name="applet"></el-tab-pane>
    </el-tabs>
    <div class="bodyTable" v-show="activeName == 'pc'">
      <el-tree
        ref="PCTree"
        :data="data"
        :props="propsData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :filter-node-method="filterNode"
      >
        <template class="custom-tree-node" v-slot="{ node,data }">
          <i class="el-icon-star-on node_icon color1" v-if="data.type==='menu'"></i>
          <i class="el-icon-s-tools node_icon color2" v-if="data.type==='func'"></i>
          <span>{{ node.label }}</span>
        </template>
      </el-tree>
    </div>

    <div class="bodyTable" v-show="activeName == 'applet'">
      <el-tree ref="appletTree" :data="appletData" :props="propsData" show-checkbox node-key="id" :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys">
        <template class="custom-tree-node" v-slot="{ node, data }">
          <i class="el-icon-star-on node_icon color1" v-if="data.type==='menu'"></i>
          <i class="el-icon-s-tools node_icon color2" v-if="data.type==='func'"></i>
          <span>{{ node.label }}</span>
        </template>
      </el-tree>
    </div>

    <footer>
      <el-button @click="handleCancelBase">取消</el-button>
      <el-button type="primary" @click="handleSaveBase">保存</el-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
// import './treeTable'
import { ref,watch,onMounted,nextTick  } from 'vue'
const props = defineProps({
    menus:{
        type:Object,
        default:()=>{}
    }
})

const activeName = ref('pc')

const appletData = ref<Recordable>([])

const defaultCheckedKeys = ref<Recordable>([])

const data = ref<Recordable>([])

const defaultExpandedKeys = ref<Recordable>([])

const travel = (menus:Recordable, name:string) => {
    defaultCheckedKeys.value = []
    let subTravel = (children:any, type:string) => {
    let dataObject:any = []
    children.forEach((item:any) => {
        let obj:any = {}
        if (type === 'menu') {
        obj = {
            menuId: item.id,
            caption: item.caption,
            id: item.id + '_menu',
            enable: item.enable,
            type: 'menu'
        }
        } else {
        obj = {
            funId: item.id,
            caption: item.caption,
            id: item.id + '_func',
            enable: item.enable,
            type: 'func'
        }
        }

        if (item.subFuncItems && item.subFuncItems.length > 0) {
        obj.children = subTravel(item.subFuncItems, 'func')
        }
        if (item.subMenuItems && item.subMenuItems.length > 0) {
        obj.children = subTravel(item.subMenuItems, 'menu')
        }
        if (!obj.children && obj.enable && obj.menuId !== 100001) {
        defaultCheckedKeys.value.push(obj.id)
        }
        dataObject.push(obj)
    })
    return dataObject
    }
    if (name === 'demoTreeTb') {
    data.value = subTravel(menus, 'menu')
    defaultExpandedKeys.value = [data.value[0].id]
    } else {
    appletData.value = subTravel(menus, 'menu')
    defaultExpandedKeys.value = [appletData.value[0].id]
    }
}

watch(()=>activeName.value,(newValue:any) => {
    console.log(newValue)
    if (newValue == 'applet' && appletData.value.length == 0) {
    window.$Api()
        .RoleController.get_funcs.request({
        path: {
            roleId: props.menus.roleId
        },
        params: {
            appName: 'applet' // appName：null，表示所有，appName：pc, pc独有，applet 代表移动端独有
        }
        })
        .then((res:any) => {
        console.log(11,res);
        travel(res.menus, 'appletTreeTb')
        // this.drawLayui('appletTreeTb')
        })
    }

    // this.$emit("updateMenus", newValue);
})

onMounted(()=>{
    console.log('onMounted',props.menus);
    travel(props.menus.menus, 'demoTreeTb')
})

const filterNode = (value:any, data:any) => {
    if (!value) return true
    return data.caption.indexOf(value) !== -1
}

const PCTree = ref()
const appletTree = ref()

const emits = defineEmits(['close'])

// 保存
const handleSaveBase = async () => {
    function getIdObj (check:any) {
    let idObj:any = {
        funcIds: [],
        menuIds: []
    }

    check.forEach((item:any) => {
        item.type === 'menu'
        ? idObj.menuIds.push(item.menuId)
        : idObj.funcIds.push(item.funId)
    })
    return idObj
    }

    // 保存pc权限列表
    let obj1 = getIdObj(PCTree.value.getCheckedNodes())

    obj1['appName'] = 'pc'
    await window.$Api().RoleController.post_assignMenuFuncs.request({
    path: {
        roleId: props.menus.roleId
    },
    headers: {
        hideNotify: appletData.value.length !== 0
    },
    data: obj1
    })
    if (appletData.value.length === 0) {
    emits('close')

    return
    }

    // 保存移动端权限列表
    let obj2 = getIdObj(appletTree.value.getCheckedNodes())
    obj2['appName'] = 'applet'
    await window.$Api().RoleController.post_assignMenuFuncs.request({
    path: {
        roleId: props.menus.roleId
    },
    data: obj2
    })
    emits('close')
}

const handleCancelBase = () => {
    emits('close')
}

// 展开全部
const expandAll = (state:any) => {
    let nodes:any
    let treeData:any
    if (activeName.value === 'pc') {
    nodes = PCTree.value.store.nodesMap
    treeData = data.value
    } else {
    nodes = appletTree.value.store.nodesMap
    treeData = appletData.value
    }

    for (var i in nodes) {
    nodes[i].expanded = state
    }
    if (state === false) {
        nextTick(() => {
        // 这个方法性能好差，谁有更好的方法吗？
        nodes[treeData[0].id].expanded = true
    })
    }
}

// 全选
const setAllChecked = (checkedAll:any) => {
    let tree:any
    let treeData:any
    if (activeName.value === 'pc') {
    tree = PCTree.value
    treeData = data.value
    } else {
    tree = appletTree.value
    treeData = appletData.value
    }
    if (checkedAll) {
    // 全选
    tree.setCheckedNodes(treeData)
    } else {
    // 取消选中
    tree.setCheckedKeys([])
    }
}

const edtSearch = ref('')

// 搜索
const filterData = () => {
    if (edtSearch.value) {
    if (activeName.value == 'pc') {
        PCTree.value.filter(edtSearch.value)
    } else {
        appletTree.value.filter(edtSearch.value)
    }
    } else {
    if (activeName.value == 'pc') {
        PCTree.value.filter()
    } else {
        appletTree.value.filter()
    }
    }
}

const clearFilter = () => {
    edtSearch.value = ''
    PCTree.value.filter()
    appletTree.value.filter()
}

const propsData = ref<Recordable>({
label: 'caption',
children: 'children'
})

const insTb = ref()
const appletInsTb = ref()


</script>

<style lang="scss"  rel="stylesheet/scss" scoped>
.permissions {
  footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  .table {
    // height: 600px;
    // overflow: hidden;
  }

  .btn-box {
    margin-bottom: 12px;
  }

  // .layui-form {
  //   height: 520px;
  //   overflow: auto;
  // }

  .ew-tree-table .el-tree-node__children {
    overflow: visible;
  }

  /*滚动条样式*/
  .ew-tree-table::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .ew-tree-table::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .ew-tree-table::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
.bodyTable {
  height: 520px;
  overflow: auto;
}
.node_icon {
  color: #ff8630;
  font-size: 18px;
  margin-right: 2px;
}
.color2{
  color: #0cb4a6;
}
 .el-button--small{
    padding: 10px 10px;
}
</style>
