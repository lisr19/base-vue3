<!-- 右上账户信息菜单 -->
<template>
  <div>
    <el-popover placement="bottom" width="156" v-model="popoverShow" trigger="hover" popper-class="popper_class"
                @before-enter="handlerHover('show')" @before-leave="handlerHover('hide')">
      <div class="user-menu-list">
        <div v-for="item in menuList" :key="item.name" class="user-menu-list-flex border-color-1" @click="item.action">
          {{ item.name }}
        </div>
      </div>
      <template #reference>
        <a slot="reference" class="user-menu">
          <i class="iconfont island-user user-icon" style="opacity: 1;"></i>
          <span class="username font-color-default" style="cursor: pointer;">{{ userInfo.name }}</span>
          <ArrowUp v-if="popoverShow" style="width: 1em; height: 1em; margin:0 3px;color: #0c1014"/>
          <ArrowDown v-else style="width: 1em; height: 1em; margin:0 3px;color: #6c727a"/>
        </a>
      </template>
    </el-popover>
  </div>

</template>
<script setup lang="ts">
import router from '@/router'
import {computed, onMounted, ref, watch} from "vue";
import {useUserStoreWidthOut} from "@/store/modules/user";
import {auth } from '@/utils/dgySdk/index'
let popoverShow = ref(false)
const handlerHover = (type: string) => {
  type === 'show' ? popoverShow.value = true : popoverShow.value = false
}
const userInfo = computed(() => {
  // return useUserStoreWidthOut().userInfo
  return $SDK.userInfo
})

const menuList = computed(() => {
  let list = []
  let filterId = ['100027'] // 加入个人中心
  const menuData = auth.menuAuth().filter((v) => filterId.includes(v.id))
  menuData.forEach(v => {
    v.children.forEach(v2 => {
      list.push({
        name: v2.name,
        id: v2.id,
        action() {
          router.push({
            path: v2.path
          });
        }
      })
    })
  })

  list.push({
    name: '登出',
    action: logout
  })
  list = list.filter(v => !['100150', '100204', '100097'].includes(v.id)) //过滤二级菜单
  return list
})

function logout() {
  useUserStoreWidthOut().logout()
}

onMounted(() => {
})

</script>

<style lang="scss" scoped>
.user-menu {
  display: flex;
  align-items: center;
  padding-left: 12px;

  .user-icon {
    // font-size: 4 * $margin-size;
    display: inline;
    margin-right: $margin-size;
    // border-radius: 50%;
    // overflow: hidden;
  }
}

.user-menu-list {
  .user-menu-list-item {
    width: 100%;
    border: none;
  }

  .user-menu-list-flex + .user-menu-list-flex {
    margin: 0px;
    // border-top: 1px solid;
    // border-radius: 0px;
  }
}

.user-menu-list-flex {
  display: flex;
  padding: 0 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: #0c1014;
  height: 40px;
  line-height: 40px;

  &:hover {
    background-color: #eaeefd;
  }

  .num {
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 10px;
    background-color: #3a64e5;
    cursor: pointer;
    color: #fff;
    width: 34px;
    margin-top: 10px;
    margin-left: 8px;
  }
}

.user-icon {
  font-size: 32px;
  color: #345ef0;
}

.username {
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
