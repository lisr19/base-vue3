<template>
    <div class="treebox">
      <div class="treebox-filter">
        <el-input placeholder="请输入名称搜索" suffix-icon="Search" v-model="treeKeyword" size="small"></el-input>
      </div>
      <div class="treebox-box">
        <el-tree
          :props="defaultProps"
          @node-click="handelClickNode"
          :data="treeData"
          ref="groupTree"
          :filter-node-method="filterNode"
          :default-expanded-keys="expandedKeys"
          class="iscroll"
          node-key="id"
        >
          <template class="custom-tree-node" v-slot="{ node,data }">
            <div class="tree-node-item">
                <span>{{ node.label }}</span>
                <span v-if="!(node.level === 1)">
                    <el-icon @click="update(node, data)" v-if="authUpdateBool" style="margin-right:8px"><Edit /></el-icon>
                    <el-icon @click="del(node, data)" v-if="authDeleteBool" style="margin-right:8px"><Delete /></el-icon>
                </span>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { has } from '@/utils/auth.ts'
  import { ref,watch,onMounted } from 'vue'

  const props = defineProps(['treeData','expandedKeys','operation','height','authIds'])


  const groupTree = ref()

    // 组织树关键词
  const treeKeyword = ref('')

  watch(()=>treeKeyword.value,(val)=>{
    groupTree.value.filter(val)
  })

  const emits = defineEmits(['chooseGroupNode','update','delete'])

  // 节点被点击
  const handelClickNode = (data:Recordable, node:any) => {
    emits('chooseGroupNode', data, node)
    }

    // 筛选组织树
    const filterNode = (value:Recordable, data:Recordable) => {
    if (!value) return true
    return data.name.indexOf(value) !== -1
    }

    const update = (node:any, data:Recordable) => {
        emits('update', node, data)
    }

    const del = (node:any, data:Recordable) => {
        emits('delete', node, data)
    }

    // 组织树数据映射字段名
    const defaultProps = ref<Recordable>({
        children: 'children',
        label: 'name'
    })


    // 允许修改
    const authUpdateBool = ref(true)
    // 允许删除
    const authDeleteBool = ref(true)

    onMounted(()=>{
        authUpdateBool.value = has(props.authIds.updateId)
        authDeleteBool.value = has(props.authIds.deleteId)
    })



  </script>

  <style lang="scss"  rel="stylesheet/scss" scoped>
  .treebox {
    overflow: hidden;
    .treebox-header {
      padding: 8px;
    }
    .treebox-filter {
      height: auto;
      // padding: 8px;
    }
    .treebox-box {
      // position: absolute;
      // top: 50px;
      // left: 8px;
      // right: 8px;
      // bottom: 8px;
      overflow: auto;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }

    .icon-sty {
      font-size: 14px;
      margin-left: 10px;
    }

    .iscroll {
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    .iscroll :deep(.el-tree-node__children) {
      overflow: visible;
    }

    /*滚动条样式*/
    .iscroll::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    .iscroll::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .iscroll::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }

  :deep(.el-tree-node__content) {
    height: 40px;
    line-height: 40px;
    }

    .tree-node-item {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
  </style>
