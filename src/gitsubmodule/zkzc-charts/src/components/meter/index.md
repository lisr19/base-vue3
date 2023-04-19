```vue
<template>
  <div style="height: 340px; background-color: #000;">
    <meter-index :chart-data="chartData" height="300px"/>
  </div>
</template>

<script>
import MeterIndex from "./index.vue";
export default {
  components: {MeterIndex},
  data() {
    return {
      chartData: {
        name: 'foobar',
        option:{
          series:[{
            data: [78],
            name: '占用率'
          }]
        }
      }
    }
  }
}
</script>

```
