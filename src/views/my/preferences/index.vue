<template>
  <div class="wrap">
    <div class="content_left">
      <div class="listtitle">目录</div>
      <div class="tree">
        <el-tree
            :data="treeData"
            ref="tree"
            :props="defaultProps"
            node-key="id"
            :current-node-key="currentNodeKey"
            highlight-current
            @node-click="handleNodeClick"
            :expand-on-click-node="false"

        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 父节点 -->
            <template>
              <p class="node_title">{{ data.name }}</p>
            </template>
          </span>
        </el-tree>
      </div>
    </div>
    <notice v-if="currentNodeKey === 'notice'"></notice>
    <warning v-if="currentNodeKey === 'warning'"></warning>
    <MapDefaultView v-if="currentNodeKey === 'mapView'" />
  </div>
</template>

<script>
import Notice from './Notice'
import Warning from './Warning'
import MapDefaultView from './MapDefaultView'
export default {
  name: 'preferences',
  components: {
    Notice,
    Warning,
    MapDefaultView
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [
        {
          name: '通知方式',
          id: 'notice'
        },
        {
          name: '告警事件订阅',
          id: 'warning'
        },
        {
          name: '地图默认视图',
          id: 'mapView'
        }
      ],
      currentNodeKey: 'notice'
    }
  },
  methods: {
    /**
     * 点击树节点
     */
    handleNodeClick (data, node) {
      console.log('data', data, node)
      this.currentNodeKey = data.id
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  min-height: calc(100%);
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
      padding: 10px 0px 20px;
      flex: 1;
      overflow: auto;
      max-height: inherit;
    }
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
  text-align: center;
  .node_title {
    width: 100%;
    text-align: center;
    margin-left: 6px;
  }
}
:deep(.el-tree-node__content) {
  height: 40px;
  &:hover {
    background-color: #eaeefd;
  }
}
:deep(.tree .is-current .node_title) {
  color: #345EF0;
}
:deep(.el-tree-node__expand-icon) {
  display: none;
}
.el-tree {
  padding-top: 10px;
}
</style>
