```vue
<template>
  <div style="height: 340px; background-color: #000;">
    <bar-column :chart-data="chartData" height="300px" />
  </div>
</template>

<script>
import BarColumn from './column.vue'
export default {
  components: { BarColumn },
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
            data: ['销量', '类目数']
          },
          xAxis: [{
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          }],
          yAxis: [{}],
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [15, 20, 36, 40, 45, 20]
            },
            {
              name: '类目数',
              type: 'bar',
              data: [5, 8, 2, 5, 7, 4]
            }
          ]
        }
      }
    }
  }
}
</script>

```
