<template>
  <el-button class="sendCodeBtn" type="primary" @click="dispatch" :disabled="dontOperate" :size="size"
             :class="[source]">
    <span v-if="remain > 0">{{ remain }}秒后重试</span>
    <span v-else>{{ msgText }}</span>
  </el-button>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import {computed} from 'vue'

//data
// 获取1次验证码间隔时间
const DELAY = ref(60)
// 剩余N秒后可以重新点击
const remain = ref(0)
// 定时器
const clocker = ref(null)
const props = defineProps({
  id: { type: String, default: null },
  size: { type: String, default: 'small' },
  disabled: { type: Boolean, default: false },
  source: { type: String, default: 'normal' },
  msgText: { type: String, default: '获取验证码' }
})
// computed
const dontOperate = computed(() => {
  return remain.value > 0 || props.disabled
})

onMounted(() => {
  fixRemain()
})
onBeforeUnmount(() => {
  // 清除定时器
  clearInterval(clocker.value)
})

// methods
const fixRemain = () => {
  let curDate = new Date()
  let vCodeTime = Cookies.get('timestamp_' + props.id)
  if (vCodeTime) {
    remain.value = Math.max(
        0,
        parseInt(DELAY - (curDate.getTime() - vCodeTime) / 1000)
    )
  } else {
    remain.value = 0
  }
  initClocker()
}
// 初始化定时器
const initClocker = () => {
  if (remain.value <= 0 || clocker.value) {
    return
  }
  clocker.value = setInterval(() => {
    if (remain.value <= 0) {
      clearInterval(clocker.value)
      clocker.value = null
    } else {
      remain.value--
    }
  }, 1000)
}
const dispatch = () => {
  // 派发事件
  // this.$emit('click', {})
}

const downcount = () => {
  // 保存当前时间
  Cookies.set('timestamp_' + props.id, new Date().getTime(), { expires: 1 })
  remain.value = DELAY.value
  initClocker()
}

</script>

<style lang="scss" scoped>
.login {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  height: 44px;
  width: 120px;
  font-weight: 300;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid #ffffff;
  }
}
</style>
