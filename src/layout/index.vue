<template>
  <div>
    <!-- 页面框架 -->
    <div class="layout">
      <LeftMenu
          :isShowFrame="isShowFrame"
          v-if="isShowFrame"
          :menuCollapse="menuCollapse"
      />
      <el-container class="main background-color">
        <template   v-if="isShowFrame">
          <HeaderBar
              @toggleCollapse="toggleCollapse"
              :isCollapse="menuCollapse"
          />
          <div class="shadow"/>
        </template>

        <div class="body">
          <router-view v-slot="scope">
            <transition name="fade-transform" mode="out-in" v-if="!iframeUrl">
              <component :is="scope.Component" :key="scope.route.key" />
            </transition>
            <transition name="fade-transform" mode="out-in" v-else>
              <iframe :src="iframeUrl" class="body-iframe" />
            </transition>
          </router-view>
        </div>
      </el-container>
    </div>

    <!-- 退出全屏按钮 -->
    <QuitFull  v-show="!isShowFrame"></QuitFull>
  </div>
</template>

<script setup lang="ts">
import LeftMenu from "@/components/LeftMenu"
import HeaderBar from '@/components/HeaderBar/index.vue'
import QuitFull from '@/components/HeaderBar/QuitFull.vue'

import {useSettingWidthOut} from "@/store/modules/setting";
import { ref} from "vue";

const iframeUrl = ref(null);
const settingStore = useSettingWidthOut();
const isShowFrame = computed(() => settingStore.isShowFrame)
const menuCollapse = ref(localStorage.hasOwnProperty('menuCollapse') ? !!localStorage.menuCollapse : false)

function toggleCollapse () {
  menuCollapse.value = !menuCollapse.value
  localStorage.menuCollapse = menuCollapse.value ? 1 : ''
}
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  display: flex;

  .main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .shadow {
      position: fixed;
      width: 100%;
      height: 56px;
      top: 0px;
      box-shadow: 0px 1px 4px rgba(0, 21, 41, 0.12);
      z-index: 5;
      pointer-events: none;
    }

    .body {
      // margin-top: 4px;
      overflow: auto;
      height: 100%;
      position: relative;
      z-index: 4;
    }
  }
  .body-iframe {
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.exit-full {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #fff !important;
  border: none !important;
  box-shadow: 0px 0px 5px rgba(22, 31, 40, 0.95);
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  text-align: left;
  color: #d3d5d9;
  z-index: 3;
  background-color: rgba(22, 31, 40, 0.95);

  .dialog_title {
    padding: 6px 10px;
    min-height: 18px;
    line-height: 18px;
    font-size: 14px;
    background-color: #1d3646;

    .dialog_headerbtn {
      padding: 0;
      background: 0 0;
      border: none;
      outline: 0;
      font-size: 14px;
      cursor: pointer;
      float: right;
      color: #678cad;

      &:hover {
        color: #409eff;
      }
    }
  }

  .dialog_body {
    min-height: 160px;
    padding: 15px 10px 10px 10px;

    .button_tool {
      padding-bottom: 5px;
    }
  }
}
</style>
