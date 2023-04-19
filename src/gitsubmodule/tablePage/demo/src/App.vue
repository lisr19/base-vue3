<script setup lang="ts">
import TablePage from "../../TablePage/TablePage.vue";
import TablePageJs from "../../TablePage/TablePage.vue3.js";
import { ref, onMounted } from "vue";

const layout = ref([
  "pageName",
  "search",
  "keyFilter",
  "selectAllBtn",
  "selectionCount",
  "pagination",
]);

interface tableData {
  deviceUid: string;
  deviceName: string;
  commandId: number;
}

const tableListData = ref({
  selection: true,
  columnFunctionsWidth: 120,
  tableData: [] as tableData[],
  tableKeys: [
    {
      id: "deviceUid",
      label: "设备UID",
      width: "200",
      allways: true,
    },
    {
      id: "deviceName",
      label: "设备名称",
      minWidth: "180",
      slotFormat: true,
    },
    {
      id: "commandId",
      label: "命令ID",
      minWidth: "180",
    },
  ],
  tableFunctions: [
    {
      label: "按钮1",
      method: (scope: any) => {
        // console.log(scope);
        alert("按钮1");
      },
      disabled: (scope: any) => {
        // console.log(scope);
        return true;
      },
    },
    {
      label: "按钮2",
      method: (scope: any) => {
        // console.log(scope);
        alert("按钮2");
      },
      hidden: (scope: any) => {
        // console.log(scope);
        return true;
      },
    },
    {
      label: "按钮3",
      method: (scope: any) => {
        // console.log(scope);
        alert("按钮3");
      },
    },
  ],
});

const loading = ref(false);

onMounted(() => {
  randomResultNum();
});

const randomResultNum = () => {
  TablePageJs.filter.rowTotal = Math.floor(Math.random() * 30);
  tableListData.value.tableData = [];
  const sampleData = {
    deviceUid: "1",
    deviceName: "deviceName",
    commandId: 2,
  };
  for (let i = 0; i < TablePageJs.filter.rowTotal; i++) {
    tableListData.value.tableData.push(sampleData);
  }
};
</script>
<template>
  <div id="app">
    <TablePage
      :layout="layout"
      :data="tableListData"
      :filter="TablePageJs.filter"
      pageName="DEMO"
      id="demo"
      :loading="loading"
      @tableSelectionChange="TablePageJs.tableSelectionChange"
      @search="randomResultNum"
      @resetSearch="TablePageJs.resetSearch"
      @sizeChange="TablePageJs.sizeChange"
      @currentChange="TablePageJs.currentChange"
      @sortChange="TablePageJs.sortChange"
      @setTableKeys="TablePageJs.setTableKeys"
      @selectAll="TablePageJs.tableSelectAllStatus"
    >
      <template #searchFilter>筛选栏插槽</template>
      <template #searchFilterExtra>筛选栏控制插槽</template>
      <template #controller>控制栏插槽</template>
      <template #column_header_deviceUid>表头插槽</template>
      <template #column_deviceUid="row">表格内容插槽{{ row.data }}</template>
    </TablePage>
  </div>
</template>
