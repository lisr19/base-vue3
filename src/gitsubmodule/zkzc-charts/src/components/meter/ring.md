```vue
<template>
  <div style="height: 340px; background-color: #000;">
    <meter-ring :chart-data="chartData" height="300px"/>
  </div>
</template>

<script>
import MeterRing from "./ring.vue";
export default {
  components: {MeterRing},
  data() {
    return {
      chartData: {
        name: 'foobar',
        option:{
          series:[{
            data: [78],
            name: '设备在线率',
            suffix: '%'
          }]
        }
      }
    }
  }
}
</script>

```
