<template>
  <div class="pagination" v-if="total">
    <el-pagination
      class="el-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes?pageSizes:[5, 10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      :popper-class="customClass"
      :pager-count="5"
      background
    />

    <div class="jumper">
      <el-input type="number" v-model="jumperNum" min="1" :max="Math.max(Math.ceil(total/pageSize),1)" class="input" @keyup.enter.native="jumperChange" />页
      <el-button link @click="jumperChange" class="button">前往</el-button>
    </div>
  </div>
</template>
<script >
export default {
  name: 'pagination',
  props: ['currentPage', 'pageSizes', 'pageSize', 'total', 'customClass'],
  data () {
    return {
      jumperNum: 1
    }
  },
  mounted () {
    this.jumperNum = this.currentPage
  },
  watch: {
    currentPage (val) {
      this.jumperNum = this.currentPage
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange (val) {
      this.$emit('current-change', val)
    },
    jumperChange () {
      this.jumperNum = Math.max(
        Math.min(
          Math.max(Math.floor(this.jumperNum), 1),
          Math.ceil(this.total / this.pageSize)
        ),
        1
      )
      this.handleCurrentChange(this.jumperNum)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" >
.pagination {
  display: flex;
  .el-pagination {
    width: 100%;
    line-height: 36px;
    .el-pagination__total {
      font-size: 14px;
      line-height: 36px;
    }
    .el-input--mini {
      input {
        font-size: 14px;
        height: 36px;
      }
    }
    .btn-prev,
    .btn-next,
    .el-pager li {
      height: 36px;
      line-height: 36px;
      min-width: 36px;
      font-weight: 300;
      font-size: 14px;
      padding: 0px 10px;
    }
    //消灭万恶的x号
    .el-pagination__sizes .el-input__suffix .el-icon-circle-close {
      display: none;
    }
  }
  .jumper {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin: 15px 0px;
    margin-left: 20px;
    margin-right: 10px;
    height: 36px;
    .input {
      margin-right: 5px;
      width: 46px;
      height: 100%;
      input {
        height: 100%;

        text-align: center !important;
        padding: 0px;
        font-size: 14px;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }
    }
    .button {
      padding: 0;
      margin-left: 10px;
      font-size: 14px;
    }
  }

  .el-pagination {
    padding: 15px 0 15px;
    min-height: 32px;
    text-align: right;
  }
  .el-pagination .el-pagination__total {
    float: left;
  }
  .el-pagination .el-pagination__sizes {
    float: left;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    margin: 0 2px;
  }

  .el-pagination .el-select .el-input .el-input__inner {
    border-color: #d6d8df !important;
  }
  .jumper .input input  {
    border-color: #d6d8df !important;
  }
  .el-pagination .el-select .el-input .el-input__inner:hover {
    border-color: #345ef0 !important;
  }
  .jumper .input input:hover  {
    border-color: #345ef0 !important;
  }
}

</style>
