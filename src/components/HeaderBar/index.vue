<template>
  <div class="header">
    <div class="headerBg background-white"/>
    <!-- 菜单折叠 -->
    <a class="menu-control" @click="$emit('toggleCollapse')">
      <svg-icon class="icon" :name="isCollapse? 'menu-open': 'menu-close'"/>
    </a>
    <!-- 标签栏 -->
    <div class="header-navbar">
      <Navbar/>
    </div>
    <!-- 按钮栏 -->
    <div class="header-control">
      <ul>
        <li class="font-color-default" @click="toggleFramework" title="全屏">
          <svg class="ali-icon " aria-hidden="true">
            <use xlink:href="#island-iisg-icon-fullscreen"></use>
          </svg>
        </li>
        <li title="账户">
          <UserMenu/>
        </li>
        <li title="换肤" style="margin-left: 10px">
          <el-color-picker v-model="defColor"></el-color-picker>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/HeaderBar/Navbar.vue'
import UserMenu from '@/components/HeaderBar/UserMenu.vue'
import {fullScreen, fullExit} from '@/utils'
import { useSettingWidthOut} from "@/store/modules/setting";
import {ref, watch,computed} from "vue";
const settingStore = useSettingWidthOut();

// props
defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
})

const isShowFrame = computed(() => settingStore.isShowFrame)

const defColor = ref<string>('#345ef0');
watch(defColor, (value: string) => {
  const dom = document.querySelector(':root')!.style;
  dom.cssText = `--systemThemeColor: ${value};--el-color-primary: ${value}`;
});
// 全屏，退出全屏
function toggleFramework () {
  if (isShowFrame) {
    fullScreen()
    settingStore.SET_IS_SHOW_FRAME(false)
  } else {
    fullExit()
  }
}
</script>
<style lang="scss" scoped>
$header-h: 56px;
.header {
  height: $header-h;
  display: flex;
  justify-content: space-between;
  $header-control-width: 400px;
  $menu-control-width: 5 * $margin-size;
  z-index: 3;
  position: relative;
  background-color: #111629;
  .headerBg {
    position: absolute;
    left: 0px;
    top: 3px;
    height: calc(100% - 3px);
    width: 100%;
    border-top-left-radius: 20px;
    z-index: -1;
  }
  .menu-control {
    width: 62px;
    margin-top: 10px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2 * $margin-size;
    cursor: pointer;
  }
  .header-navbar {
    width: calc(100% - #{$header-control-width} - 10px);
    height: 100%;
    display: flex;
    align-items: center;
  }
  .header-control {

    flex: 1;
    ul {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      padding: 0px 24px 0 $margin-size;
      li {
        font-size: 2 * $margin-size;
        line-height: $header-h;
        height: calc(100% - 5px);
        min-width: 36px;
        text-align: center;
        cursor: pointer;

      }
    }
  }
}
</style>