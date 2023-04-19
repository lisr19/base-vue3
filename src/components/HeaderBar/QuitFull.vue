<template>
  <!-- 退出全屏按钮 -->
  <el-button
      class="exit-full"
      @click="quitFullScreen"
      type="primary"
      circle
  >
    <img src="@/assets/image/icon/iisg-icon-exitfullscreen-page.svg"/>
  </el-button>
</template>
<script setup lang="ts">
import {useSettingWidthOut} from "@/store/modules/setting";
import {onMounted} from "vue";

const settingStore = useSettingWidthOut();
import {fullExit} from '@/utils'

const isShowFrame = computed(() => settingStore.isShowFrame)
onMounted(() => {
  window.addEventListener('webkitfullscreenchange', (evt) => {
    if (!document.fullscreen && !isShowFrame.value) {
      quitFullScreen()
    }
  })
})

// methods
const quitFullScreen = () => {
  settingStore.toggleFrame()
  fullExit()
}

</script>
<style lang="scss" scoped>
.exit-full {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #fff !important;
  border: none !important;
  box-shadow: 0px 0px 5px rgba(22, 31, 40, 0.95);
}
</style>
