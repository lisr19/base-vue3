```vue
<template>
  <div style="height: 340px; background-color: #000;">
    <bar-index :chart-data="chartData" height="300px" />
  </div>
</template>

<script>
import BarIndex from './index.vue'
export default {
  components: { BarIndex },
  data() {
    return {
      chartData: {
        name: 'foobar',
        option: {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: [{
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          }],
          yAxis: [{}],
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [51, 20, 36, 10, 10, 20]
            }
          ]
        }
      }
    }
  }
}
</script>

```
