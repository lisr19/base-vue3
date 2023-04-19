<!-- 左侧菜单栏 -->
<template>
  <div class="menu-bar" :class="menuCollapse ? 'isCollapse' : ''">
    <!-- 个性化图标 -->
    <div class="logo">
      <img :src="personal.logo" class="icon"/>
      <div class="title" v-if="!menuCollapse">{{ personal.portalTitle || "智慧灯杆云" }}</div>
    </div>
    <div class="menu-bar-list">
      <div class="menu-bar-lv1" v-for="item in menuData" :key="item.id">
        <!-- 1级 -->
        <div class="menu-bar-lv1-item"
             :active="menuSelect.includes(item.path)"
             :select="menuSelect[menuSelect.length - 1] === item.path"
             @click="handleMenuSelect(item, [item],$event)" :title="item.name">
          <div class="name">
<!--            <svg class="ali-icon menu-icon" aria-hidden="true">-->
<!--              <use :xlink:href="`#island-${item.path.replace('/','')}`"></use>-->
<!--            </svg>-->
            <i class="iconfont menu-icon" :class="`island-${item.path.replace('/','')}`"></i>
            <!-- 折叠不显示名字 -->
            <span class="font-color-white" v-if="!menuCollapse">
              {{ item.name }}
            </span>
          </div>
          <template v-if="!menuCollapse">
            <div class="collapse" v-if="item.children && item.children.length > 0">
              <el-icon v-if="item.isCollapse" color="white">
                <ArrowUp/>
              </el-icon>
              <el-icon v-else color="white">
                <ArrowDown/>
              </el-icon>
            </div>
          </template>
        </div>
        <MenuItem :isCollapse="item.isCollapse" :menuCollapse="menuCollapse" :menus="item.children"
                  :menuSelect="menuSelect"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, provide, ref, watch} from "vue";
import {auth } from '@/utils/dgySdk/index'
const router = useRouter();
const route = useRoute();
import {useUserStoreWidthOut} from "@/store/modules/user";

const userStore = useUserStoreWidthOut()

defineProps(['menuCollapse'])
provide('handleMenuSelect', handleMenuSelect)
// 个性化配置
const personal = computed(() => {
  return userStore.personal.portal
})
let menuSelect = ref([])

watch(route, (val) => {
  menuSelect.value = []
  val.matched.forEach((v:Recordable) => {
    // menuSelect.value.push(v.path)
    if (v.path !== '/:pathMatch(.*)*') {  //无对应路由匹配跳转
      menuSelect.value.push(v.path)
    } else {
      menuSelect.value = ['/:pathMatch(.*)*']
      menuSelect.value.push(val.path)
    }
  })
  handleOtherMenuFlod()
}, {immediate: true})

onMounted(() => {
  menuData.value = userStore.menuList = auth.menuData()
  userStore.getPersonal()
})


let menuData = ref([])


function handleMenuSelect(item, path, event) {
  event.preventDefault()
  // 没有子目录
  if (!item.children || !item.children.length) {
    if (item.openType === 'link') {
      window.open(item.path, '_blank')
    } else {
      router.push({path: item.path})
    }
  } else {
    item.isCollapse = !item.isCollapse
  }
}
// 把所有其他菜单都折叠
function handleOtherMenuFlod(){
  let routePath = menuSelect.value
  if (routePath.includes('/:pathMatch(.*)*')) {
    return false
  }
  userStore.menuList.forEach((lv1) => {
    if (!routePath.includes(lv1.path)) {
      lv1.isCollapse = false
    }
    if (lv1.children) {
      lv1.children.forEach((lv2) => {
        if (!routePath.includes(lv2.path)) {
          lv2.isCollapse = false
        }
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.menu-bar {
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 256px;

  .logo {
    width: 100%;
    height: 56px;
    flex-shrink: 0;
    padding-left: 32px;
    display: flex;
    align-items: center;
    background-color: #111629;
    .title {
      margin-left: 7px;
      color: #dbdcdf;
      font-size: 18px;
      font-family: PingFangSC-Regular;
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      opacity: 0;
      transition: opacity .5s;

      &.opcity1 {
        opacity: 1;
      }
    }

    .icon {
      height: 36px;
    }
  }

  .menu-icon {
    margin-right: 10px;
    color: #fff;
    font-size: 18px;
    vertical-align: -2px;
    opacity: 0.7;
  }

  .menu-bar-list {
    padding: 24px 0px;
    height: 100%;
    overflow: auto;

    .menu-bar-lv1 {
      min-height: 48px;
      width: 100%;

      .menu-bar-lv1-item {
        transition: all 0.5s;
        cursor: pointer;
        height: 48px;
        font-size: 14px;
        font-weight: 400;
        opacity: 0.7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 16px 4px 32px;

        .icon {
          margin-right: 10px;
        }

        &:hover {
          opacity: 1;
        }
      }

      .menu-bar-lv1-item[active='true'] {
        opacity: 1;
        font-weight: 600;
      }

      .menu-bar-lv1-item[select='true'] {
        position: relative;

        &::before {
          height: 40px;
          position: absolute;
          content: ' ';
          left: 24px;
          right: 16px;
          top: 4px;
          border-radius: 4px;
          z-index: 0;
        }

        .name {
          position: relative;
          z-index: 1;
        }
      }
    }
  }

  // 滚动条
  .menu-bar-list::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background-color: transparent;
    overflow-y: scroll;
  }
}

@keyframes menu-show {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.menu-bar.isCollapse {
  $bar-width: 80px;
  width: $bar-width;
  flex-shrink: 0;

  .logo {
    justify-content: center;
    padding-left: 0px;
  }

  .menu-icon {
    margin-right: 0;
  }

  .menu-bar-list {
    // 一级菜单
    .menu-bar-lv1 {
      .menu-bar-lv1-item {
        padding: 4px 16px;
        display: flex;
        justify-content: center;

        .icon {
          margin-right: 0px;
        }

        .name {
          img {
            margin-right: 0px !important;
          }
        }

        &[select] {
          &::before {
            left: 20px;
            right: 20px;
          }
        }
      }
    }
  }

}

</style>
