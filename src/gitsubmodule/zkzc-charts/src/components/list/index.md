```vue

<list-index :chart-data="chartData"/>

<script>
import ListIndex from "./index";
export default {
  components: {ListIndex},
  data(){
    return{
      chartData:{
        chartTable:{
          tableHeader:[
            {label:'名称', value:'name'},
            {label:'性别', value:'sex'},
            {label:'年龄', value:'age'},
          ],
          tableData: [
            {name: '张三', sex:'男', age: 12},
            {name: '张三', sex:'男', age: 12},
            {name: '张三', sex:'男', age: 12},
            {name: '张三', sex:'男', age: 12},
            {name: '张三', sex:'女', age: 12},
          ]
        } 
      }
    }
  }
}
</script>
```
