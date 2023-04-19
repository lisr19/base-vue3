<template>
  <div class="wrap">
    <div class="content_left">
      <div class="listtitle">分组列表</div>
      <div class="tree">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" suffix-icon="el-icon-search"></el-input>
        <el-tree
          :data="treeData"
          ref="tree"
          :props="defaultProps"
          node-key="deviceType"
          :current-node-key="currentNodeKey"
          highlight-current
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 父节点 -->
            <template v-if="node.level===1">
              <span>
                <!--                <i class="el-icon-folder-opened"></i>-->
                <span class="node_title"></span>
                {{ node.label }}
              </span>
              <span>
                <el-button class="level_btn" icon="el-icon-plus" size="small" @click.stop="addDict(data, node)"></el-button>
              </span>
            </template>
            <!-- 子节点 -->
            <template v-else>
              <span v-if="data.name.length && data.name.length < 8" class="group-name-txt">{{ data.name }}</span>
              <el-tooltip v-else class="item" effect="dark" :content="data.name" placement="top-end">
                <span class="group-name-txt">{{ data.name }}</span>
              </el-tooltip>
              <span>
                <el-button class="level_btn" link icon="el-icon-edit" size="small" circle @click.stop="editDict(data, node)"></el-button>
                <el-button class="level_btn" link icon="el-icon-delete" size="small" circle @click.stop="deleteDict(data.id, node.key)"></el-button>
              </span>
            </template>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="content_right" ref="rightDom">
      <table-page
        :data="tableListData"
        :filter="filter"
        :hideSearch="true"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @tableSelectionChange="tableSelectionChange"
        @setTableKeys="setTableKeys"
        @selectAll="tableSelectAllStatus"
        ref="table"
        id="groupManagement1"
      >
        <template v-slot:column_deviceArea="row">
          <span>{{dictData['areaIndex'][row.value.deviceArea]}}</span>
        </template>
        <template v-slot:column_deviceType="row">
          <span>{{dictData['productModel'][row.value.productModelId].deviceTypeName}}</span>
        </template>
        <template v-slot:column_productCode="row">
          <span>{{dictData['productModel'][row.value.productModelId].name}}</span>
        </template>
        <!-- 控制栏 -->
        <template slot="controller">
          <!--          <el-button icon="el-icon-circle-plus" @click="add" type="primary" v-if="has('100352')" size="small">新增</el-button>-->
          <!--          <el-button icon="el-icon-circle-plus" type="primary" @click="add()" v-if="has('100354')" size="small" :disabled="!currentNode.deviceTypeEnum">添加设备</el-button>-->
          <iotdevicecheck-list :btnDisabled="!currentNode.deviceTypeEnum" @input="getCheckVal" :boxStyle="checkBtnStyle" :configs="configs"></iotdevicecheck-list>
          <el-button icon="el-icon-remove" type="primary" plain :disabled="this.multiData.length===0" @click="remove()" size="small">删除</el-button>
        </template>
      </table-page>
    </div>
    <group-type v-if="dialog==='type'" :data="currentNode" @close="dialog=null" @refreshTree="refreshTree" :deviceTypeCode="currentNodeParentKey" :deviceTypeEnum="deviceTypeEnum"></group-type>
  </div>
</template>

<script>
import auth from '@/utils/auth'
// import TablePage from '@/components/TablePage/TablePage.vue'
// import tablePageJs from '@/components/TablePage/TablePage.js'
import GroupType from './GroupType'
// import IotdevicecheckList from '@/components/f-render/components/IotdevicecheckList/index.vue'
export default {
  data () {
    return {
      deviceTypeEnum: 'IOTDEVICE', // 这个页面 固定参数为IOTDEVICE 物联网设备 后续可能扩展
      dialog: null,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: null, // 总条数
        pageSizes: [10, 20, 50, 100]
      },
      filterText: '',
      treeData: [],
      toDictNew: '',
      currentNodeKey: '',
      currentNode: '',
      currentNodeParentKey: '',
      defaultProps: {
        children: 'children',
        label: 'deviceTypeName',
        isLeaf: 'leaf'
      },
      tableData: [],
      editData: {},
      tableHeight: '',
      checkBtnStyle: {
        display: 'inline-block',
        marginRight: '10px'
      }
    }
  },
  components: {
    TablePage,
    GroupType,
    IotdevicecheckList
  },
  mixins: [auth, tablePageJs],
  computed: {
    dictData () {
      return this.$SDK.dict
    },
    configs () {
      console.log('currentNode', this.currentNode)
      console.log('currentNodeKey', this.currentNodeKey)
      console.log('currentNodeParentKey', this.currentNodeParentKey)
      return {
        selectorModel: 'multiple',
        productModelId: '',
        deviceType: this.currentNodeParentKey || '',
        onlyActive: true
      }
    },
    tableListData () {
      let tableData = {
        selection: true,
        columnFunctionsWidth: 180, // 操作栏宽度
        tableData: this.tableData,
        tableKeys: [
          // 表格标签
          // {
          //   id: 'dictSort',
          //   label: '序号',
          //   width: '80'
          // },
          {
            id: 'name',
            label: '设备名称'
          },
          {
            id: 'uid',
            label: '设备UID'
          },
          {
            id: 'deviceArea',
            label: '设备区域'
          },
          {
            id: 'deviceType',
            label: '设备类型'
          },
          {
            id: 'productCode',
            label: '设备型号'
          }
        ],
        tableFunctions: []
      }
      if (!this.inFrame) {
        tableData.tableFunctions = this.authTableFunctions
      }
      return tableData
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.setTree()
  },
  beforeMount () {},
  mounted () {
    // 设置表格高度
    this.tableHeight = this.$refs.rightDom.clientHeight - 205

    this.allTableFunction = []
    this.authTableFunctions = this.getAuthTableFunctions(this.allTableFunction)
  },
  methods: {
    async setTree (refreshTree) {
      // 获取分组
      // let treeData1 = await window.$Api().DeviceController.get_list.request()
      let treeData2 = await window.$Api().GroupManageController.post_tree.request(
        {
          headers: {
            hideNotify: true
          }
        }
      )
      console.log('treeData2', treeData2)
      // let formatDeviceTypeList = []
      // treeData1.forEach((item, index) => {
      //   let formatTypeList = formatDeviceTypeList.map(v => v.deviceType)
      //   // 过滤掉已经添加过的
      //   if (formatTypeList.indexOf(item.deviceType) < 0) {
      //     formatDeviceTypeList.push(item)
      //   }
      // })
      this.treeData = treeData2.map((item) => {
        item.children = item.groupInfDTOS
        return item
      })
      if (refreshTree) {
        return
      }
      // 初始化，先展示数据分组类中的第一项数据
      let t = this
      try {
        let node = t.treeData
        if (node) {
          let id = node.id
          t.getData(id)

          t.$nextTick(() => {
            t.currentNode = node
            t.currentNodeKey = node.id
            t.$refs.tree.setCurrentKey(id)
          })
        }
      } catch (err) {}
    },
    // 动态加载子节点
    async loadNode (node, resolve) {
      console.log('node', node, this.treeData)
      if (node.level > 1) return resolve([])

      if (node.level === 1) {
        let list =
          await window.$Api().GroupManageController.get_group_list.request({
            params: {
              deviceTypeEnum: this.deviceTypeEnum,
              deviceTypeCode: node.key
            }
          })
        if (list && list.length) {
          list = list.map((item) => {
            return Object.assign({}, item, {
              deviceType: item.id,
              deviceTypeName: item.name,
              leaf: true // 没有下一级
            })
          })
        }
        resolve(list)
      }
    },
    /**
     * 点击树节点
     */
    handleNodeClick (data, node) {
      console.log('data', data, node)
      this.currentNode = data
      this.currentNodeKey = data.id
      this.currentNodeParentKey = node.level === 2 ? node.parent.key : node.key
      if (node.level === 2) {
        this.filter.pageNum = 1
        this.getData(data.id)
      } else {
        // 父节点
      }
    },
    /**
     * 节点树过滤
     */
    filterNode (value, data) {
      console.log('value', value)
      console.log('data', data)
      if (!value) return true
      return (data.deviceTypeName || data.name).indexOf(value) !== -1
    },
    /**
     * 获取分组list deviceTypeCode当前 isRefreshParent是否刷新父节点
     */
    async refreshTree (deviceTypeCode, isRefreshParent) {
      await this.setTree('refreshTree')
      // 刷新当前的树
      let node = this.$refs.tree.getNode(deviceTypeCode)
      if (isRefreshParent) {
        node = node.parent
      }
      node.loaded = false
      node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
      // 重新获取树结构
    },

    /**
     * 获取表格数据
     */
    getData (id = this.currentNodeKey) {
      if (!id) {
        return
      }
      let data = {
        condition: {
          groupId: id
        },
        pageNum: this.filter.pageNum,
        pageSize: this.filter.pageSize
      }
      let t = this
      window.$Api()
        .GroupManageController.post_pageList.request({
          data,
          headers: {
            hideNotify: true
          }
        })
        .then((res) => {
          console.log('res', res)
          t.tableData = res.data || []
          this.filter.pageNum = res.pageNum
          this.filter.rowTotal = res.total
        })
        .catch((err) => {
          t.tableData = []
          this.filter.pageNum = 1
          this.filter.rowTotal = 0
        })
    },
    /**
     * 新增数据分组（非类型）
     */
    add () {
      this.toDictNew = this.currentNode
      this.dialog = 'new'
    },
    /**
     * 编辑
     */
    edit (scope) {
      this.editData = { model: 'edit', ...scope.row }
      this.toDictNew = this.currentNode
      this.dialog = 'new'
    },
    /**
     * 删除
     */
    remove (scope) {
      let ids = []
      // 单选
      if (scope) {
        ids.push(scope.row.id)
      } else {
        // 多选
        ids = this.multiData.map((item) => {
          return item.id
        })
      }

      if (ids.length === 0) {
        return
      }
      let str = ids.join(',')
      this.$confirm('是否确定删除已选数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.$Api()
          .GroupManageController.delete_device.request({
            path: {
              groupId: this.currentNodeKey,
              ids: str
            }
          })
          .then((res) => {
            this.filter.pageNum = 1
            this.getData()
          })
      })
    },
    /**
     * 新增分组类型
     */
    addDict (data, node) {
      this.currentNode = data
      this.currentNodeKey = data.id
      this.currentNodeParentKey = node.level === 2 ? node.parent.key : node.key
      this.dialog = 'type'
    },
    editDict (data, node) {
      this.currentNode = data
      this.currentNodeKey = data.id
      this.currentNodeParentKey = node.level === 2 ? node.parent.key : node.key
      this.dialog = 'type'
    },
    /**
     * 删除分组类型
     */
    deleteDict (ids, key) {
      this.$confirm('是否确定删除此条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.$Api()
          .GroupManageController.delete_group.request({
            path: {
              ids
            }
          })
          .then((res) => {
            this.tableData = []
            this.currentNodeKey = ''
            this.currentNode = {}
            this.refreshTree(key, true)
          })
      })
    },
    getCheckVal (val) {
      console.log('获取选项', val)
      let checkIdList = val.map((item) => item.id)
      window.$Api()
        .GroupManageController.post_device.request({
          data: {
            deviceModelId: checkIdList,
            groupId: this.currentNodeKey
          }
        })
        .then((res) => {
          console.log('res', res)
          this.filter.pageNum = 1
          this.getData()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  height: calc(100%);

  padding: 20px;
  display: flex;
  .content_left {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 5px;
    min-width: 257px;
    .listtitle {
      padding: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #0c1014;
      border-bottom: 1px solid #e8e8e8;
    }
    .tree {
      padding: 20px;
      flex: 1;
      overflow: auto;
      max-height: inherit;
    }
  }
  .content_right {
    flex: 1;
    margin-left: 24px;
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  color: #0d1115;
  .group-name-txt {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.node_title {
  margin-left: 6px;
}
.level_btn {
  padding: 0px;
  color: #848d99;
}
.sort_btn {
  padding: 3px;
  font-size: 14px;
  color: #6e7986;
  font-weight: bold;
  i {
    font-weight: bolder;
  }
}
:deep(.el-tree-node__content) {
  height: 40px;
  &:hover {
    background-color: #eaeefd;
  }
}
.el-tree {
  padding-top: 10px;
}
</style>
