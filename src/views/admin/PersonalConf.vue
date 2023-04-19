<template>
  <div style="position: relative" class="area">
    <div class="area-sub background-white">
      <div class="area-title">目录</div>
      <ul class="diy-tab">
        <li
          v-for="(item, index) in navList"
          :class="{ active: index == navIndex }"
          :key="index"
          @click="setCurNav(index)"
          v-if="has(index === 0 ? '100031' : '100032', 'menu')"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <div class="area-main flex2 background-white">
      <div class="area-title">{{ navList[navIndex].label }}</div>
      <div class="area-main-box">
        <!--登录页配置-->
        <diy-login
          v-if="navIndex == 0 && has('100031', 'menu') && initConfData.esso"
          :initData="initConfData.esso"
          @update="getData"
        ></diy-login>

        <!--主界面配置-->
        <diy-main
          v-if="navIndex == 1 && has('100032', 'menu') && initConfData.portal"
          :initData="initConfData.portal"
          @update="getData"
        ></diy-main>

        <!-- 大屏配置 -->
        <diy-large-screen
          v-if="navIndex == 2 && initConfData.screen"
          :initData="initConfData.screen"
          @update="getData"
        ></diy-large-screen>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DiyLogin from './personalConf/DiyLogin'
import DiyMain from './personalConf/DiyMain'
import DiyLargeScreen from './personalConf/DiyLargeScreen'

import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { watch, onMounted, ref, computed } from 'vue'

const initConfData = ref<Recordable>({
    esso: null,
    portal: null
})

const getData = () => {
    // 获取当前配置方案
    window.$Api()
    .ThemePersonalizationController.get_personalizedSettings.request()
    .then((res:any) => {
        let data:Recordable = {}
        res.forEach((item:any) => {
        if (data[item.personalizationSystem] === undefined) {
            data[item.personalizationSystem] = {}
        }
        data[item.personalizationSystem][item.personalizationType] = {
            id: item.id,
            url: item.link,
            title: item.title,
            type:
            item.personalizationKey.indexOf('.mp4') != -1 ? 'video' : 'img'
        }
        })
        initConfData.value = data
    })
}

const navIndex = ref(0)

const setCurNav = (index:any) => {
    navIndex.value = index
}

const navList = ref<Recordable>([
{ label: '登录页配置' },
{ label: '主界面配置' },
{ label: '大屏标题配置' }
])

onMounted(()=>{
    getData()
})

</script>

<style lang="scss" scoped>
@import "@/assets/system.scss";
.area {
  height: 100%;
  padding: 24px;
  display: flex;
  .area-sub {
    padding: 0;
    border-right: none;
    border-radius: 5px;
  }
  .area-main {
    padding: 0;
    margin: 0 0 0 24px;
    border-radius: 5px;
  }
  .area-title {
    padding: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #0c1014;
    border-bottom: 1px solid #e8e8e8;
  }
}

.diy-tab {
  padding: 20px 0;
  li {
    position: relative;
    padding: 16px;
    cursor: pointer;
    text-align: center;
    &:hover {
      background-color: #eaeefd;
    }
    &.active {
      background-color: #eaeefd;
      color: #486ef1;
    }
  }
}
</style>
