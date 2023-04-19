<template>
  <div class="table-page" ref="page">
    <!-- 表格名字 -->
    <div class="path" v-if="showLayout.pageName">{{ pageName }}</div>
    <!-- 表格内容 -->
    <div class="content" :class="customClass" ref="content">
      <div class="tab-panel">
        <div class="wrapper">
          <div ref="top">
            <!-- 搜索栏 -->
            <div
              class="searchFilter showMore-searchFilter"
              v-show="showLayout.search"
            >
              <div id="searchInput" class="searchInput" ref="searchInput">
                <slot name="searchFilter" />
              </div>
              <div class="searchControl">
                <!-- 额外的搜索控制栏，用于放置折叠筛选项、添加查询条件等功能 -->
                <slot name="searchFilterExtra" />

                <el-button type="primary" @click="search" size="small"
                  >查询</el-button
                >
                <el-button size="small" @click="resetSearch">重置</el-button>
              </div>
            </div>

            <!-- 控制栏 -->
            <div
              class="button-group"
              :style="showLayout.keyFilter ? 'min-height: 40px;' : ''"
              ref="button-group"
            >
              <div
                class="button-group-select"
                v-if="(data.selection || false) && showLayout.selectionCount"
              >
                <label class="button-group-select-label">
                  已选择
                  <span class="font-color-theme">{{ selectNum }}</span
                  >项
                </label>
                <el-button link @click="clearSelect" :disabled="!selectNum"
                  >取消已选</el-button
                >
                <el-button
                  link
                  @click="selectAllFunc"
                  v-if="showLayout.selectAllBtn"
                  >全选</el-button
                >
              </div>

              <div class="button-group-controller">
                <slot name="controller" ref="controller" />
              </div>
              <!-- 右侧表格显示列筛选 -->
              <div v-if="showLayout.keyFilter">
                <el-popover
                  trigger="click"
                  popper-class="key-filter"
                  @show="keyFilterShow"
                >
                  <template #reference>
                    <el-button link slot="reference" class="font-color-default">
                        <el-icon style="margin-right: 4px;"><Setting /></el-icon>

                      列设置
                    </el-button>
                  </template>
                  <template #default>
                    <div class="key-filter-reset border-color-1">
                      <el-button
                        link
                        class="key-filter-reset-button"
                        @click="checkAllKeys"
                        >全选
                      </el-button>
                    </div>
                    <div ref="draggable" class="key-filter-list">
                      <div
                        v-for="(item, index) in tableKeys"
                        :key="'checker_' + item.id"
                        style="cursor: move"
                        :index="index"
                      >
                        <el-checkbox
                          v-model="item.checked"
                          :disabled="item.allways"
                          @change="keysCheckChange"
                          style="cursor: move"
                          >{{ item.label }}
                        </el-checkbox>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
          <!-- 列表 -->
          <div class="table" ref="middle">
            <el-table
              @header-dragend="handleHeaderDragend"
              :data="tableData"
              ref="typeTable"
              @selection-change="handleSelect"
              @sort-change="sortChange"
              :cell-class-name="customClass"
              :row-class-name="customClass"
              :header-row-class-name="customClass"
              v-loading="loading"
              :height="height"
              :max-height="maxHeight"
            >
              <el-table-column
                type="selection"
                align="center"
                fixed="left"
                v-if="data.selection || false"
                :selectable="
                  (row) => {
                    return data.selectable
                      ? data.selectable(row)
                      : () => {
                          return true;
                        };
                  }
                "
              />

              <template v-for="(item, index) in tableKeys">
                <!-- 默认列 -->
                <el-table-column
                  :prop="item.id"
                  :key="`table_${item.id}_${index}`"
                  :min-width="item.minWidth ? item.minWidth : '80px'"
                  :width="item.width ? item.width : ''"
                  :label="item.label"
                  v-if="item.checked"
                  :show-overflow-tooltip="
                    item.hasOwnProperty('overflowTooltip')
                      ? item.overflowTooltip
                      : true
                  "
                  :sortable="item.sortable"
                  :fixed="item.fixed"
                  :id="item.id"
                >
                  <template #header>
                    <slot :name="`column_header_${item.id}`">
                      {{ item.label }}
                    </slot>
                  </template>
                  <template v-slot="scope">
                    <slot :name="`column_${item.id}`" :data="scope.row">
                      <span
                        v-if="item.formatter"
                        class="el-tooltip"
                        v-html="item.formatter(scope.row)"
                      />
                      <template v-else>
                        {{ rowValue(scope, item.id) }}
                      </template>
                    </slot>
                  </template>
                </el-table-column>
              </template>
              <!-- 操作栏 操作大于4个时，显示更多 -->
              <el-table-column
                label="操作"
                :width="calFuncWidth(data.funcWidth)"
                align="left"
                v-if="data.tableFunctions && data.tableFunctions.length"
                fixed="right"
              >
                <template v-slot="scope">
                  <div
                    class="control_wrap"
                    :style="`width: ${calFuncWidth(scope.row.funcWidth)}px;`"
                    :key="scope.row.uid"
                  >
                    <template v-for="(item, index) in scope.row.tableFunctions">
                      <div
                        class="control-item"
                        v-if="
                          index <
                            (scope.row.tableFunctions.length === 4 ? 4 : 3) &&
                          item.type === 'switch'
                        "
                        :key="`table-function-${scope.$index}-${index}`"
                      >
                        <el-switch
                          :active-value="item.activeValue"
                          :inactive-value="item.inactiveValue"
                          :active-color="item.activeColor || '#1579eb'"
                          :inactive-color="item.inactiveColor || '#dcdfe6'"
                          v-model="scope.row[item.vModel]"
                          :disabled="item.functionDisabled"
                          :key="item.label"
                          @change="item.method(scope)"
                          style="margin-right: 10px"
                        ></el-switch>
                        <span style="margin-right: 8px; color: #0c1014">{{
                          scope.row[item.vModel] === item.activeValue
                            ? item.activeText || "启用"
                            : item.inactiveText || "禁用"
                        }}</span>
                      </div>

                      <el-button
                        v-else-if="
                          index <
                          (scope.row.tableFunctions.length === 4 ? 4 : 3)
                        "
                        :disabled="item.functionDisabled"
                        :key="item.label"
                        @click="item.method(scope)"
                        link
                        :style="`width: ${scope.row.funcWidth[index]}px;`"
                        >{{
                          typeof item.label === "string"
                            ? item.label
                            : item.label(scope)
                        }}</el-button
                      >
                    </template>
                    <!-- 更多 -->
                   <template v-if="scope.row.tableFunctions.length > 4">
                        <!-- el-popover实现浮窗  -->
                        <el-popover
                             placement="right-end"
                              width="156"
                              popper-class="morePopover"
                              trigger="click"
                              transition="fade-in-linear"
                              @hide="scope.row.moreFunc = false"
                        >
                          <transition  name="el-collapse-transition">
                              <div
                                v-if="scope.row.moreFunc"
                                id="more-method"
                                ref="moreMethod"
                                class="more-method"
                              >
                                <div v-for="(item, index) in scope.row.tableFunctions">
                                    <div
                                        v-if="index >= 3"
                                        :key="item.label"
                                        class="button font-color-main text-hide"
                                        :class="item.functionDisabled ? 'disabled' : ''"
                                        type="text"
                                        :title="item.label"
                                        @click="
                                            () => {
                                                if (!item.functionDisabled)
                                                    item.method(scope);
                                            }
                                        "
                                    >
                                        {{ item.label }}
                                    </div>
                                </div>


                            </div>
                          </transition>

                            <template #reference>
                              <el-button

                                  type="text"
                                  @click.native="updateMoreFuncPopover($event, scope)"
                              >
                                  更多
                                  <i
                                      v-if="!scope.row.moreFunc"
                                      class="el-icon-arrow-down"
                                  ></i>
                                  <i
                                      v-if="scope.row.moreFunc"
                                      class="el-icon-arrow-up"
                                  ></i>
                              </el-button>
                            </template>


                        </el-popover>
                        <!-- <el-button
                          link
                          @click="updateMoreFuncPopover($event, scope)"
                        >
                          更多
                          <i
                            class="el-icon-arrow-down"
                            v-if="!scope.row.moreFunc"
                          />
                          <i class="el-icon-arrow-up" v-if="scope.row.moreFunc" />
                          <div
                            class="more-method"
                            v-if="scope.row.moreFunc"
                            :style="`
                                                    transform: translateY(-${
                                                      (scope.$index /
                                                        (tableData.length - 1)) *
                                                      100
                                                    }%);
                                                  `"
                            :showbox="moreMethodMounted()"
                            ref="moreMethod"
                          >
                            <template
                              v-for="(item, index) in scope.row.tableFunctions"
                            >
                              <div
                                class="button font-color-main"
                                :class="item.functionDisabled ? 'disabled' : ''"
                                v-if="index >= 3"
                                :key="item.label"
                                @click="
                                  () => {
                                    if (!item.functionDisabled)
                                      item.method(scope);
                                  }
                                "
                                link
                              >
                                {{
                                  typeof item.label === "string"
                                    ? item.label
                                    : item.label(scope)
                                }}
                              </div>
                            </template>
                          </div>
                        </el-button> -->

                      </template>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div ref="bottom" v-if="showLayout.pagination">
            <pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="filter.pageNum"
              :page-sizes="filter.pageSizes"
              :page-size="filter.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filter.rowTotal"
              :customClass="customClass"
              background
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "./pageination.vue";
import sortable from "./sortable.complete.esm.js";
import {deepClone} from './global.js'
const layoutList = [
  "pageName", //表格名称
  "search", //筛选栏
  "keyFilter", //列设置
  "selectAllBtn", //全选按钮
  "selectionCount", //已选数字
  "pagination", //分页
];

export default {
  components: {
    pagination,
  },
  props: {
    // 布局显示隐藏
    layout: {
      type: Array,
      default: layoutList,
    },
    // 表格数据
    data: {
      type: Object,
      require: true,
      default: {
        tableData: [],
        tableKeys: [],
      },
    },
    // 页码和数据条数
    filter: {
      type: Object,
      default: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: 0, // 总条数
        sortName: "",
        sortOrder: "",
        pageSizes: [10, 20, 50, 100],
      },
    },
    // 表格名称
    pageName: {
      type: String,
    },
    //  表格ID，用于记录表格操作的唯一标识
    id: {
      type: String,
      default: "tablepage",
    },
    // 表格自定义样式
    customClass: {
      type: String,
      default: "",
    },
    // 是否显示加载中
    loading: {
      type: Boolean,
      default: false,
    },
    // 表格高度
    height: {
      type: String,
    },
  },
  name: "TablePage",
  data() {
    return {
      tableKeys: [], // 表格列是否显示
      tableData: [], // 表格数据
      tableIndex: null, // 表格自定义排序
      multiData: [], // 多选数据
      selectAll: false, // 是否全选
      maxHeight: null, // 表格最大高度，不超过页面高度
    };
  },
  watch: {
    selectAll(value) {
      this.$emit("selectAll", value);
    },
    "data.tableData": {
      async handler(v, oldVal) {
        if (!v) {
          return;
        }
        this.tableData = deepClone(v);
        // 操作项
        this.tableData.forEach((item) => {
          item.tableFunctions = [];
          let scope = {
            row: item,
          };
          if (this.data.tableFunctions) {
            this.data.tableFunctions.forEach((funcs) => {
              let f = {};
              // copy
              for (let i in funcs) {
                f[i] = funcs[i];
              }
              if (!f.hidden || (f.hidden && !f.hidden(scope))) {
                f.functionDisabled = false;
                if (f.disabled) {
                  f.functionDisabled = f.disabled(scope);
                }
                item.tableFunctions.push(f);
              }
            });
          }
        });
        this.callFunctionBtnWidth();
        this.setTableHeight(); // 设置列表高度

        // 如果列表数据没有变化，不执行默认选择状态设置
        if (
          oldVal &&
          v.map((v) => v.id).join(",") === oldVal.map((v) => v.id).join(",")
        ) {
          return;
        }
        await this.$nextTick();
        this.tableData.forEach((row) => {
          if (this.$refs.typeTable) {
            this.$refs.typeTable.toggleRowSelection(row, !!row.defaultSelect);
          }
        });


      },
      immediate: true,
      deep: true,
    },
    "data.tableKeys": {
      async handler(v, oldVal) {
        // console.log("tableKeys change", v);
        if (!v) {
          return;
        }
        if (!v.length && (!oldVal || !oldVal.length)) {
          return;
        }
        if (oldVal) {
          // 表头有无变化
          // 如果表头无变化，不执行重新渲染
          let newKeys = v.map((v) => v.id);
          let oldKeys = oldVal.map((v) => v.id);

          if (newKeys.join(",") === oldKeys.join(",")) {
            return;
          }
        }
        this.setTableKeys();
        // this.setSearchLineItemNum();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    selectNum() {
      if (this.selectAll) {
        return this.filter.rowTotal || 0;
      } else {
        return this.multiData.length;
      }
    },
    //   显示的模块
    showLayout() {
      let result = {};
      layoutList.forEach((v) => {
        result[v] = this.layout.includes(v);
      });
      return result;
    },
  },
  mounted() {
    window.addEventListener("resize", this.setTableHeight);
    // window.addEventListener("click", (e) => this.clickOtherHideElement(e));
    this.setTableHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.setTableHeight);
    // window.removeEventListener("click", (e) => this.clickOtherHideElement(e));
    // let body = this.$el.parentElement.parentElement
    // body.removeEventListener('scroll', this.getMoreMethodTop)
  },
  methods: {
    // 实现点击当前元素以外的地方隐藏当前元素
    clickOtherHideElement(e) {
      const dom = this.$refs.moreMethod;
      if (!dom) {
        return;
      }
      const isSelf = dom.contains(e.target);
      if (!isSelf) {
        const parentLen = dom.parentElement.textContent.length;
        const targetLen = e.target.textContent.length;
        if (parentLen !== targetLen) {
          this.tableData[this.targetIdx].moreFunc=false
          // this.$set(this.tableData[this.targetIdx], "moreFunc", false);
        }
      }
    },
    async moreMethodMounted(val) {
      await this.$nextTick();
      if (this.$refs.moreMethod) {
        this.getMoreMethodTop();
      }
    },
    getMoreMethodTop() {
      let dom = this.$refs.moreMethod;
      if (!dom) {
        return;
      }
      let top = dom.parentElement.getBoundingClientRect().top;
      let left = dom.parentElement.getBoundingClientRect().left;
      dom.style.top = top + 20 + "px";
      dom.style.left = left - 160 + "px";
    },

    updateMoreFuncPopover(evt, scope) {
      // console.log(evt, scope)
      let tableData = deepClone(this.tableData);
      tableData.forEach((item, index) => {
        if (index !== scope.$index) {
          // this.$set(this.tableData[index], "moreFunc", false);
          this.tableData[index].moreFunc=false

          // this.tableData[index].moreFunc=false
        } else {
          let moreFuncShow = deepClone(!scope.row.moreFunc);
                console.log(!scope.row.moreFunc)
          debugger
          this.tableData[index].moreFunc=moreFuncShow
                                  console.log(this.tableData[index])

          // this.$set(this.tableData[index], "moreFunc", moreFuncShow);
        }
        // 记录当前更多按钮下标，以供隐藏时使用
        this.targetIdx = scope.$index;
      });
    },
    // 计算表格高度
    async setTableHeight() {
       // 先撑大列表
       this.maxHeight = 100000
      await this.$nextTick()
      const options = {
        root: null, // 用于检查目标的可见性。必须是目标元素的祖先节点。
        rootMargin: "0px", // 给祖先节点设置margin，等同于css中的margin。用来扩展或缩小`rootBounds`这个矩形的大小，从而影响`intersectionRect`交叉区域的大小。
        threshold: 1, //表示当子元素和父元素覆盖多少时触发回调函数。
      };
      const _this = this;
      const observer = new IntersectionObserver((entries) => {
        // console.log(
        //   entries,
        //   entries[0].intersectionRatio,
        //   entries[0].intersectionRect.height,
        //   entries[0].boundingClientRect.height
        // );
        if (
          entries[0].intersectionRect.height <
          entries[0].boundingClientRect.height
        ) {
          _this.maxHeight = entries[0].intersectionRect.height - 48;
        }

        observer.disconnect();
      }, options);
      if(!this.$refs.middle){
        return
      }
      observer.observe(this.$refs.middle);

    },
    selectAllFunc() {
      if (this.tableData.length === 0) {
        this.$message.error("没有可选数据");
        return;
      }
      let table = this.$refs.typeTable;
      this.tableData.forEach((v) => {
        table.toggleRowSelection(v, true);
      });
      this.selectAll = true;
    },
    clearSelect() {
      let table = this.$refs.typeTable;
      table.clearSelection();
      this.selectAll = false;
    },
    // 更新表头
    async setTableKeys(tableIndex) {
      await this.$nextTick();
      if (tableIndex) {
        this.tableIndex = tableIndex;
        // 加载tableIndex
        // 把tableKeys的check状态修改成tableIndex状态
        // console.log('设置tableIndex', tableIndex)
        this.tableKeys = [];
      }
      this.tableKeys = [];

      // 更新表头涉及排序和选择状态
      // 涉及到3个数据：data.tableKeys,传入的key，tableKeys，本地的key，tableIndex，缓存的排序和选择状态规则

      // 第一步，计算增加和减少的keys
      let newKeys = this.data.tableKeys.map((v) => v.id);
      let oldKeys = this.tableKeys.map((v) => v.id);
      let addKeys = newKeys.filter((v) => !oldKeys.includes(v)); // 增加的keys
      let delKeys = oldKeys.filter((v) => !newKeys.includes(v)); // 删除的keys

      // 第二步，增加的keys根据tableIndex排序
      if (this.tableIndex) {
        let sortAddKeys = [];
        this.tableIndex.forEach((v) => {
          if (addKeys.includes(v.id)) {
            sortAddKeys.push(v.id);
          }
        });
        addKeys.forEach((v) => {
          if (!sortAddKeys.includes(v)) {
            sortAddKeys.push(v);
          }
        });

        addKeys = sortAddKeys;
      }

      // 第三步，改变的keys加入或踢出tableKeys
      let keyCheckStatus = {};
      if (this.tableIndex) {
        this.tableIndex.forEach((v) => {
          keyCheckStatus[v.id] = v.checked;
        });
      }
      let tableKeysIndex = {};
      this.data.tableKeys.forEach((v) => {
        tableKeysIndex[v.id] = v;
      });
      addKeys.forEach((v) => {
        let checked = true;
        if (keyCheckStatus.hasOwnProperty(v)) {
          checked = keyCheckStatus[v];
        }
        this.tableKeys.push(Object.assign(tableKeysIndex[v], { checked }));
      });
      delKeys.forEach((v) => {
        let index = this.tableKeys.map((v) => v.id).indexOf(v);
        this.tableKeys.splice(index, 1);
      });
    },
    // 显示表格的值
    rowValue(scope, id) {
      try {
        let value = (scope.row[id] ?? '') + "";
        return value || "-";
      } catch (error) {
        return "";
      }
    },
    /**
     *@Description:分页切换
     *@params {String}:每页条数
     */
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    /**
     *@Description:当前页切换
     *@params {String}:页码
     */
    handleCurrentChange(val) {
      this.$emit("currentChange", val);
    },
    handleHeaderDragend() {
      this.$emit("headerDragend", arguments);
    },
    /**
     *@Description:多选
     *@params {Object}:多选数据
     */
    handleSelect(data) {
      this.multiData = data;
      this.selectAll = false;
      this.$emit("tableSelectionChange", data);
    },
    /**
     * 排序
     */
    sortChange({ column, prop, order }) {
      this.$emit("sortChange", { column, prop, order });
    },
    /**
     * 表头拖动排序
     */
    dragEnd(evt) {
      const newKeys = [];
      for (let i = 0; i < this.tableKeys.length; i++) {
        let index = i;
        // 交换INDEX
        if (evt.oldIndex === i) {
          index = evt.newIndex;
        }
        if (evt.newIndex === i) {
          index = evt.oldIndex;
        }
        newKeys[index] = this.tableKeys[i];
      }
      this.tableKeys = newKeys;

      this.saveKeys();
    },
    checkAllKeys() {
      this.tableKeys.map((v) => {
        v.checked = true;
      });
      this.keysCheckChange();
    },
    keysCheckChange() {
      this.$forceUpdate();
      this.saveKeys();
    },
    async saveKeys() {
      // 保存表格顺序,返回事件
      let tableIndex = this.tableKeys.map((v) => {
        return { id: v.id, checked: v.checked };
      });
      this.$emit("setTableKeys", tableIndex);
    },
    search() {
      this.$emit("search");
    },
    resetSearch() {
      this.$emit("resetSearch");
    },
    /**
     * 计算列表操作列 功能按钮长度
     */
    callFunctionBtnWidth() {
      let funcWidth = { 0: 0, 1: 0, 2: 0, 3: 0 };
      this.tableData.forEach((item) => {
        for (
          let i = 0;
          i <
          (item.tableFunctions.length >= 4 ? 4 : item.tableFunctions.length);
          i++
        ) {
          let textLength = item.tableFunctions[i].label.length;
          if (textLength * 16 + (i > 2 ? 20 : 14) > funcWidth[i]) {
            // 按钮长度 + 按钮间隔
            funcWidth[i] = textLength * 16 + (i > 2 ? 20 : 14);
          }

          if (item.tableFunctions[i].type === "switch") {
            funcWidth[i] = funcWidth[i] + 180;
          }
        }
      });
      this.tableData.forEach((item) => {
        item.funcWidth = funcWidth;
      });
      this.data.funcWidth = funcWidth;
    },
    /**
     * 计算列表操作列总长度
     */
    calFuncWidth(funcs) {
      let sum = 0;
      Object.values(funcs).forEach((item, index) => {
        sum += item;
      });
      sum += 10;
      return sum;
    },

    // 列设置显示
    keyFilterShow() {
      // 注册表头拖动
      const draggable = this.$refs.draggable;
      new sortable(draggable, {
        animation: 150,
        onEnd: this.dragEnd,
      });
    },
  },
};
</script>

<style scoped>

.table-page {
  position: relative;
}

.table-page .content {
  text-align: left;
  box-sizing: border-box;
}

.table-page .content .wrapper .button-group {
  margin-bottom: 16px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-page .content .wrapper .button-group .button-group-select {
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 8px;
}

.table-page
  .content
  .wrapper
  .button-group
  .button-group-select
  .button-group-select-label {
  margin-right: 8px;
}

.table-page
  .content
  .wrapper
  .button-group
  .button-group-select
  .button-group-select-label
  span {
  padding: 0px 8px;
}

.table-page .content .wrapper .button-group .button-group-controller {
  width: 100%;
}

.key-filter .key-filter-reset {
  border-bottom: 1px solid;
  margin-bottom: 8px;
}

.key-filter .key-filter-reset .key-filter-reset-button {
  padding: 0px;
  margin-bottom: 8px;
}

.key-filter .key-filter-list {
  max-height: 300px;
  overflow: auto;
}
/* 通过button实现浮窗 */
/* .more-method {
  position: fixed;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  width: 156px;
  z-index: 100;
  padding: 8px 0;
  border-radius: 4px;
}

.more-method .button {
  height: 40px;
  margin: 0px;
  text-align: left;
  font-size: 14px;
  line-height: 40px;
  padding-left: 16px;
  cursor: pointer;
} */
/* el-popover */
.more-method {
    z-index: 100;
    padding: 8px 0;
    width: 156px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 15%);

}
.more-method .button {
        margin: 0;
        padding-left: 16px;
        height: 40px;
        font-size: 14px;
        text-align: left;
        line-height: 40px;
        cursor: pointer;
}
.more-method .button:hover {
    background-color: #eaeefd;
}

.more-method .disabled {
  color: #c7c9d1 !important;
  cursor: not-allowed;
}

</style>

<style>

@charset "UTF-8";
/**
* 表格
*/

.el-table .el-button {
  padding: 0px 5px;
}

.el-table th {
  background-color: #f9fafc !important;
  color: #666;
}

.el-table-column--selection .cell {
  text-overflow: unset;
}

.el-table__expanded-cell[class*="cell"] {
  padding: 5px;
}

/*防止表头会出现填充不满问题*/
.el-table td.gutter,
.el-table th.gutter {
  display: block !important;
}

.control_wrap .el-button {
  margin: 0px;
  padding: 0px !important;
  border: 0px;
}

.control_wrap .el-button span {
  display: inline-block;
  width: 100%;
  text-align: left;
}

.control_wrap .control-item {
  display: inline-block;
}

.searchFilter .el-input {
  width: 100% !important;
}

.showMore-searchFilter {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.showMore-searchFilter .searchInput {
  width: 100%;
  overflow: hidden;
}

.showMore-searchFilter .searchInput .el-form--inline .el-form-item {
  margin-right: 0px;
  white-space: nowrap;
  display: inline-flex;
}

.showMore-searchFilter
  .searchInput
  .el-form--inline
  .el-form-item
  .el-form-item__content {
  flex-grow: 1;
}

.showMore-searchFilter .searchInput .el-form--inline .search2x {
  width: 560px;
}

.showMore-searchFilter
  .searchInput
  .el-form--inline
  .search2x
  .el-input__inner {
  width: 100%;
}

@media screen and (max-width: 1600px) {
  .showMore-searchFilter .searchInput .el-form--inline .el-form-item {
    min-width: 300px;
    width: 32%;
    white-space: nowrap;
  }
  .showMore-searchFilter
    .searchInput
    .el-form--inline
    .el-form-item
    .el-form-item__content {
    width: calc(100% - 100px);
  }
  .showMore-searchFilter
    .searchInput
    .el-form--inline
    .el-form-item
    .el-form-item__content
    .el-input {
    width: 100%;
  }
  .showMore-searchFilter .searchInput .el-form--inline .search2x {
    min-width: 600px;
    width: 64%;
  }
}

.showMore-searchFilter .searchControl {
  margin-left: 10px;
  text-align: right;
  flex-shrink: 0;
  height: 54px;
}

.path {
  height: 56px;
  line-height: 56px;
  margin: 0 20px;
  border-bottom: 1px solid #dddddd;
  font-size: 16px;
  color: #666666;
  font-weight: bold;
  text-align: left;
}

.el-main-body {
  position: relative;
  margin: 6px;
  border: 1px solid #ddd;
  background-color: #fff;
  min-height: 95%;
  box-sizing: border-box;
}

.tableKeys-all {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.tableKeys-select {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-color: #409eff;
  color: #409eff;
}

.tableKeys-select i {
  display: inline-block;
  width: 0px;
}

.el-table td,
.el-table th {
  height: 44px;
  line-height: 44px;
  padding: 0px;
}

.el-table th > .cell {
  font-size: 14px;
  font-weight: 400 !important;
}

.el-table__fixed-right::before {
  height: 0px;
}
.morePopover {
    padding: 0  !important;
}
/* elementplus与selecttion多选框列，导致计算有问题，表格会抖动 */
.el-table__body-wrapper .el-table-column--selection>.cell, .el-table__header-wrapper .el-table-column--selection>.cell{
  display: flex !important;
}
</style>
