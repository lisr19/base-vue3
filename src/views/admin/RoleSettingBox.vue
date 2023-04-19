<template>
  <div style=" padding-right: 6px; max-height: 400px; overflow: auto;" class="iscroll">
    <div class="rolebox">
      <div class="rolebox-body" v-if="array.length > 0">
        <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
        >全选
        </el-checkbox>
        <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
          <ul>
            <li v-for="item in array" :key="item.id">
              <el-checkbox :label="item.id" class="checkbox-name" :title="item.name">{{ item.name }}</el-checkbox>
            </li>
          </ul>
        </el-checkbox-group>
        <div class="foot">
          <el-button type="primary" size="small" @click="handleSaveSetting">保存配置</el-button>
        </div>
      </div>
      <p v-else>{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from "vue";

const emits = defineEmits(["handleSaveSetting"]);
const props = defineProps({
  array: {
    type: Array,
    default: () => []
  },
  checkeds: {
    type: Array,
    default: () => []
  },
  message: {
    type: String,
    default: '暂无数据'
  }
})
// 全选状态
let checkAll = ref(false)

// 半选状态
let isIndeterminate = ref(true)

// 选中
let checkList = ref([...props.checkeds])

onMounted(() => {
  checkAll.value = checkList.value.length === props.array.length
  isIndeterminate.value = checkList.value.length > 0 && checkList.value.length < props.array.length
})

// 点击全选时
const handleCheckAllChange = (val:boolean) => {
  checkList.value = val ? props.array.map(item => item.id) : []
  isIndeterminate.value = false
}
// 点击复选框时
const handleCheckedChange = (value:string[]) => {
  let checkedCount = value.length
  checkAll.value = checkedCount === props.array.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.array.length
}
// 保存配置
const handleSaveSetting = () => {
  emits('handleSaveSetting', checkList.value)
}

</script>

<style lang="scss" scoped>
.rolebox {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;

  .rolebox-head {
    padding: 0px 6px 6px;
    border-bottom: 1px solid #dcdfe6;
  }

  .rolebox-body {
    padding-top: 10px;

    ul {
      overflow: hidden;
    }

    li {
      padding: 6px 0;
      display: inline-block;
      width: 33.3%;

      .el-checkbox__label {
        padding-right: 10px;
        vertical-align: top;
        white-space: normal;
      }
    }

    .foot {
      text-align: right;
    }
  }
}

.checkbox-name {
  width: 100%;

  :deep(.el-checkbox__label) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 90%;
  }
}
</style>
