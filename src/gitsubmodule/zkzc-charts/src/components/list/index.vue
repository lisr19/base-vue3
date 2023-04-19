<template>
  <div class="list-chart ">
    <div v-if="data.chartTable" class="chart-table-wrapper iscroll">
      <el-table
        header-row-class-name="list-chart-header"
        row-class-name="list-chart-row"
        :data="data.chartTable.tableData"
        border
        style="width: 99.5%"
      >
        <el-table-column v-for="item in data.chartTable.tableHeader" :key="item.value" :prop="item.value" :label="item.label" />
      </el-table>
    </div>
    <data-adorn :is-empty="dataEmpty" :is-error="dataError" :is-loading="dataLoading" />
  </div>
</template>

<script>

import Super from '../super/index.vue'
import DataAdorn from '../data-adorn/index.vue'
/**
 * 文字列表，依赖el-table
 */
export default {
  name: 'ListIndex',
  components: {
    DataAdorn
  },
  extends: Super,
  data() {
    return {
      data: {
      },
      // 页码信息
      page: {
        pageNumber: 1,
        pageSize: 5,
        rowTotal: 1,
        pagerCount: 5
      },
      updateTime: null,
      dataError: false,
      dataEmpty: false
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
    render(data) {
      this.data = data
    },
    handleCurrentChange(val) {
      this.page.pageNumber = val
      this.getData()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getData()
    },
    // 获取数据并更新
    async getData() {
      const res = await this.fetchData()
      this.render(res)
    }
  }
}
</script>

<style  lang="scss"  rel="text/scss"  scoped>
.list-chart {
  padding: 10px;
  box-sizing: border-box;
  height:100%;
  width:100%;

  &-header {
    th {
      background-color: #d7dffb ;
      color: #4B5869;
    }
    .cell{
      padding: 6px 0;
    }
  }
  &-row {
    td {
      color: #282c30;
    }
    .cell{
      padding: 6px 0;
    }
  }
  &-row:nth-child(even){
    td{
      background-color: #eaedf9 ;
    }
  }

  .el-pagination{
    padding:8px 0 0;
  }
  .desc{
    margin: 0;
    padding: 0 4px 10px;
    font-size: 12px;
    color: #aaa;
  }
  .chart-table-wrapper {
    padding-bottom: 10px;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
