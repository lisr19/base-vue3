<template>
  <!-- 加一个form是为了避免表格嵌套在form内，导致收到form的自动提交等影响 -->
  <el-form class="pagination" v-if="typeof(total)==='number'">
    <el-pagination
      class="el-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes ? pageSizes : [5, 10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      :popper-class="customClass"
      background
    />
    <div class="jumper">
      <el-input
        type="number"
        v-model="jumperNum"
        min="1"
        :max="Math.max(Math.ceil(total / pageSize), 1)"
        class="input"
        @keyup.enter.native="jumperChange"
        size="small"
      />页
      <el-button link @click="jumperChange" class="button">前往</el-button>
    </div>
  </el-form>
</template>
<script>
export default {
  name: "pagination",
  props: ["currentPage", "pageSizes", "pageSize", "total", "customClass"],
  data() {
    return {
      jumperNum: 1,
    };
  },
  mounted() {
    this.jumperNum = this.currentPage;
  },
  watch: {
    currentPage(val) {
      this.jumperNum = this.currentPage;
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("size-change", val);
    },
    handleCurrentChange(val) {
      this.$emit("current-change", val);
    },
    jumperChange() {
      this.jumperNum = Math.max(
        Math.min(
          Math.max(Math.floor(this.jumperNum), 1),
          Math.ceil(this.total / this.pageSize)
        ),
        1
      );
      this.handleCurrentChange(this.jumperNum);
    },
  },
};
</script>
<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 8px;
}


.pagination .jumper{
  display: flex;
  align-items: center;
  min-width: 100px;
}
</style>
