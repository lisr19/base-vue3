
<template>
  <el-config-provider v-bind="config">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const config = reactive({
  locale: zhCn,
  size: 'default',
  button: {
    autoInsertSpace: true
  },
  message: {
    max: 3
  }
})
</script>

