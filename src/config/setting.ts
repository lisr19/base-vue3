import { defineAsyncComponent } from 'vue';

const chartTypeMap:Recordable = {
  // 'List': { label: '数据列表', component: () => import('@/components/dashboard/GridChart') },
  // 'Histogram': { label: '柱状图', component: () => import('@/components/dashboard/BarChart') },
  // 'LineChart': { label: '线图', component: () => import('@/components/dashboard/LineChart') },
  // 'PieChart': { label: '饼图', component: () => import('@/components/dashboard/PieChart') },
  // 'Counter': { label: '计数器', component: () => import('@/components/dashboard/SingleNum') },
  // 'Iframe': { label: '小页面', component: () => import('@/components/dashboard/OneIframe') },
  // // 改版后
  // 'video': { label: '视频', component: () => import('@/components/dashboard/VideoBoard.vue') },
  // 'number': { label: '数据统计', component: () => import('@/components/dashboard/Number') }, // 兼容旧d版本废弃图表
  // 'number/index': { label: '数据统计', component: () => import('@/components/dashboard/Number') }, // 兼容旧d版本废弃图表

  // v3
  'bar': { label: '柱状图/默认', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/index.vue')) },
  'bar/index': { label: '柱状图/默认', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/index.vue')) },
  'bar/cube': { label: '柱状图/方柱', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/cube.vue')) },
  'bar/column': { label: '柱状图/圆柱', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/column.vue')) },
  'bar/stack': { label: '柱状图/圆柱', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/stack.vue')) },
  'bar_stack': { label: '柱状图/堆叠', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/stack.vue')) },
  'bar_stack/index': { label: '柱状图/堆叠', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/bar/stack.vue')) },

  'line': { label: '线图', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/line/index.vue')) },
  'line/index': { label: '线图', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/line/index.vue')) },
  'line/area': { label: '线图', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/line/area.vue')) },

  'pie': { label: '饼图/默认', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/pie/index.vue')) },
  'pie/index': { label: '饼图/默认', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/pie/index.vue')) },
  'pie/solid': { label: '饼图/3d', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/pie/solid.vue')) },

  'counter': { label: '计数器', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/counter/index.vue')) },
  'counter/index': { label: '计数器/条状计数器', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/counter/index.vue')) },
  'counter/catalog': { label: '计数器/图标计数器', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/counter/catalog.vue')) },

  'pattern': { label: '条纹', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/pattern/index.vue')) },
  'pattern/index': { label: '条纹', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/pattern/index.vue')) },

  'list': { label: '数据列表', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/list/index.vue')) },
  'list/index': { label: '数据列表', component: () => defineAsyncComponent(()=>import('@/gitsubmodule/zkzc-charts/src/components/list/index.vue')) },

  // 'custom/asset-count-panel': { label: '资产数量统计', component: () => import('@/components/dashboard/custom/asset-count-panel.vue') },
  // 'custom/online-rate-panel': { label: '设备在线率', component: () => import('@/components/dashboard/custom/online-rate-panel.vue') }
}

export default {
  /**
   * 系统名称
   */
  title: '智慧灯杆云',

  /**
   * @type  {string | array} 'production' | ['production','development]
   * @description 在什么模式下打印错误日志，默认值为production
   */
  errorLog: 'production',

  /**
   * 分页规则
   */
  pageRange: [10, 50, 100, 200],

  /**
   * 数字输入框最大值
   */
  inputNumberMax: 999999999,
  /**
   * 仪表盘面板最多支持个数
   */
  maxPanelsNum: 9,
   /**
   * 仪表盘面板类型
   */
   chartTypeMap,
  /**
     * 图表配色方案
     */
  chartColors: [
    { id: 'default', name: '默认', data: ['#2a7af5', '#06c0cd', '#7ac425', '#f9bb0e', '#f76c0d', '#fd4d62', '#8843f6', '#362ab2'] },
    { id: 'fade blue', name: '渐变蓝', data: ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'] }
  ],
  hosts: {
    'zhmh': { url: 'http://localhost:8888/' },
    'iot': { url: '' },
    'csmb': { url: 'http://' + window.location.hostname + ':10007' }
  }
}

export function getChartType ({ type, outward }:Recordable) {
  let key = type + (outward ? ('/' + outward) : '')
  let match = chartTypeMap[key]
  if (!match) {
    console.error(`setting.js getChartType 没找到匹配的图表`)
  }
  return match.component
}