```vue

<template>
  <div style="height: 330px; background-color: #000;">
    <pie-solid :chart-data="chartData" height="300px"/>
  </div>
</template>

<script>
import PieSolid from "./solid.vue";
export default {
  components: {PieSolid},
  data(){
    return{
      chartData:{
        name: 'foobar',
        option: {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: [ 'Search Engine', 'Direct', 'Email', 'Union Ads'  ]
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    }
  }
}
</script>
```
