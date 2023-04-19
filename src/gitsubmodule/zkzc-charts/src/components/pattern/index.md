```vue
<template>
  <div style="height: 260px; width: 400px; background-color: #000; ">
    <pattern-index :chart-data="chartData"/>
  </div>
</template>

<script>
import PatternIndex from "./index";
export default {
  components: {PatternIndex},
  data(){
    return{
      chartData:{
          name: 'foobar',
          option: {
            title: {
              text: '示例'
            },
            xAxis: [{
              data: ['摄像头', 'LED屏幕', '广告屏', '单灯节点', '充电桩', '气象站']
            }],
            yAxis: [{}],
            series: [
              {
                name: '数量',
                data: [
                  '30/50',
                  '68/100',
                  '50/60',
                  '120/150',
                  '80/150',
                  '90/200',
                ]
              }
            ]
          }
        
      }
    }
  }
}
</script>
```
