## TABLE PAGE

## 安装

目前推荐使用子模块将本项目加入需要使用的项目中。

## 使用说明

### PROPS

| KEY | 数据类型 | 说明 | 参考值/默认值 |
| --- | --- | --- | --- |
| layout | Array | 组件包含哪些模块，默认全显示 | \[ "pageName", "search", "keyFilter", "selectAllBtn", "selectionCount", "pagination"\] |
| data | Object | 表格的数据 | 详见 data对象 |
| filter | Object | 页码和条数数据 | 详见filter对象 |
| pageName | String | 表格名字 |   |
| id | String | 表格ID，确定表格的唯一性，一般用于储存表头排序的key | tablepage |
| customClass | String | 自定义样式表名字 |   |
| loading | Boolen | 是否显示加载中提示 | false |
| height | String | 表格的高度，超过高度出现垂直滚动条 |   |

### SLOT

| KEY | 说明 |
| --- | --- |
| searchFilter | 以插槽形式加入筛选项 |
| searchFilterExtra | 额外的搜索控制栏，用于放置折叠筛选项、添加查询条件等功能 |
| controller | 控制栏的插槽 |
| column\_header\_${key} | 表头的插槽，${key}对应的是data中tablekeys的id |
| column\_${key} | 自定义表格列的插槽,${key}对应的是data中tablekeys的id，用法为`<template v-slot:column_b="row"> b: {{ row.value.b }} </template>` |

### EVENT

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| tableSelectionChange | 表格勾选列变化 | Array:当前选择项 |
| selectAll | 是否全选 | Boolen:是否全选 |
| sizeChange | 表格每页条数变化 | Number:每页条数 |
| currentChange | 当前页码变化 | Number:当前页码 |
| sortChange | 表格排序变化 | {column:？？？,prop:String 排序的项id,order:String 正序(ascending)还是倒序} |
| setTableKeys | 表头排序变化 | Array:表格排序和是否选择{id:key:checked:true} |
| search | 查询 | null |
| resetSearch | 重置 | null |
| headerDragend | 表头拖动 | arguments\[width,oldWidth,column,event\] |

### data对象

```javascript
{
        selection: true,  //筛选框
        columnFunctionsWidth: 120,  //操作栏宽度
        tableData: [  //表格数据(ARRAY)
          {
            deviceUid: 1,
            deviceName: "deviceName",
            commandId: 2,
          },
        ],
        tableKeys: [  //表头数据(ARRAY)
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
        tableFunctions: [ //操作栏数据(ARRAY)
          {
            label: "按钮",
            method: (scope) =&gt; {
              alert("按钮");
            },
            disabled: (scope) =&gt; {
              return true;
            },
          },
          {
            label: "按钮",
            method: (scope) =&gt; {
              alert("按钮");
            },
            hidden: (scope) =&gt; {
              return true;
            },
          },
          {
            label: "按钮",
            method: (scope) =&gt; {
              alert("按钮");
            },
          },
        ],
      }
```

### filter对象

```javascript
{
  pageSize: 10, // 每页条数
  pageNum: 1, // 当前页
  rowTotal: null, // 总条数
  sortName: '',//排序列id
  sortOrder: '',//排序列排序方式(asc,dsc)
  pageSizes: [10, 20, 50, 100]//每页数量选项
}
```

## 更新日志

### v 4.0.001 2023-1-28

*   适配vue3
*   增加默认参数，tablePage调用不加入任何的参数也能成功调用
*   优化高度计算方式

### v 3.2.001 2023-1-10

*   增加表头的插槽，可以自定义表头内容
*   表头排序的vuedraggable直接放在组件内，不适用npm拉取
*   更新了demo

### v 3.1.001 2022-8-22

*   增加headerDragend事件，表头拖动时，会触发此事件。用于记录用户拖动表头大小。
*   去掉一些无用的变量和函数
*   目前大部分优化已经完成，下一步主要对自动调整表格大小的代码进行优化

### v 3.0.001 2022-8-12

*   重新设计传入的props：
    *   用layout来定义显示的模块，去掉隐藏某些模块的props参数
*   去掉filterForm（vue-ele-form生成的筛选栏），filterForm的组件非常依赖项目中的vue-ele-form的组件，包括非常多的自定义组件，把它放在公共组件中不是一个好的方案。
*   去掉筛选栏的折叠功能，增加一个筛选栏的控制插槽，业务上再通过插槽进行控制筛选栏折叠，或者配置筛选项等功能。

### v 2.0.007 2021-10-27

*   增加详细说明文档
*   去掉filterCondition,业务使用插槽来实现

### v.2.0.001 2021-7-26

*   功能和样式升级成三合一版本的TABLEPAGE

### v.1.0.104 2021-6-16

*   增加默认是否折叠查询栏选项
*   分类显示增加高度限制，超过高度可以滚动

### v1.0.102 2021-6-7

*   增加合计栏选项

### v1.0.101 2021-3-23

*   组件增加table-page的class

### v1.0.100 2021-3-23

*   修改加载表头时，把所有表头的checked变为true的bug

### v1.0.99 2021-1-21

*   修改搜索栏展开和折叠的实现方式，减低引用时出现的显示错误

### 1.0.98 2021-1-21

*   修复表格内容如果是0时，显示-的BUG
*   修复列控制栏操作是否显示(hidden)返回值反了的BUG
*   增加loading参数和height参数，用于显示表格数据加载中，和表格高度

### 2020-12-30

*   修复一个页面使用多个TABLEPAGE组件的时候，是否折叠搜索栏的判断会冲突的问题

## 发布组件

npm publish  
参考 https://thoughts.teambition.com/workspaces/5e52957ec4ed11001afb229d/docs/5f2a2bdb77f66f000165992c

## 使用组件

http://192.168.1.106:4873/-/web/detail/zkzc-table-page