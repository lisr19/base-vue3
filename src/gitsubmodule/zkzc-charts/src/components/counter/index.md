```vue
<template>
  <div style="height: 260px; width: 400px; background-color: #000; ">
    <counter-index  :chart-data="chartData"  height="300px" ></counter-index>
  </div>
</template>
<script>
import CounterIndex from "./index";
export default {
  components: {CounterIndex},
  data(){
    return {
      chartData: {
        name: 'foobar',
        option: {
          title: {
            text: '数据统计'
          },
          series: [{
            name: '物联网设备数量统计',
            data: [
              {name: '摄像头', value: 5410},
              {name: '单灯节点', value: 20130},
              {name: '气象站', value: 65},
              {name: '充电桩', value: 120},
              {name: '单灯控制器', value: 77.66},
              {name: '边缘网关', value: 120},
              {name: '信息发布屏', value: 98.61},
              {name: '雷达', value: 120}
            ]
          }]
        }
      }
    }
  }
}
</script>


```
