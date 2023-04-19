<template>
  <div class="menu-bar-lv2-list menu-bar-lv2" v-if="isCollapse||menuCollapse">
    <div class="menu-bar-lv2" v-for="item in menus" :key="item.id">
      <template v-if="item.children&&item.children.length>0">
        <div class="menu-bar-lv2-item"
             :active="menuSelect.includes(item.path)"
             :select="menuSelect[menuSelect.length - 1] === item.path"
             @click="handleMenuSelect(item,[item],$event)">
          <div class="name">
            <i v-if="showDot" class="iconfont dot background-white"/>
            <i v-else class="iconfont menu-icon" :class="`island-${item.icon}`"></i>
            <span class="font-color-white">{{ item.name }}</span>
          </div>
          <div class="collapse">
            <template v-if="!menuCollapse">
              <el-icon v-if="item.isCollapse" color="white">
                <ArrowUp/>
              </el-icon>
              <el-icon v-else color="white">
                <ArrowDown/>
              </el-icon>
            </template>
            <template v-else>
              <el-icon color="white">
                <ArrowRight/>
              </el-icon>
            </template>
          </div>
        </div>
        <MenuItem v-if="(menuCollapse || item.isCollapse) && item.children" class="menu-item-bar menu-item-list"
                  :menuCollapse="menuCollapse" :menuSelect="menuSelect" :isCollapse="item.isCollapse"
                  :menus="item.children"/>

      </template>
      <div v-else class="menu-bar-lv2-item"
           :active="menuSelect.includes(item.path)"
           :select="menuSelect[menuSelect.length - 1] === item.path"
           @click="handleMenuSelect(item,[item],$event)">
        <div class="name">
          <i v-if="showDot" class="iconfont dot background-white"/>
          <i v-else class="iconfont menu-icon" :class="`island-${item.icon}`"></i>
          <span class="font-color-white">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
const handleMenuSelect = inject('handleMenuSelect')
const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  //子菜单展开折叠
  isCollapse: {
    type: Boolean,
  },
  //左侧菜单折叠
  menuCollapse: {
    type: Boolean,
  },
  //选中路由
  menuSelect: {
    type: Array,
  },
  // 子菜单展示圆点
  showDot: {
    type: Boolean,
    default: true,
  }
})
</script>

<style lang="scss" scoped>
.menu-bar-lv2-list {
  padding: 8px 0px;

  .menu-bar-lv2-item {
    transition: all 0.5s;
    margin: 4px 16px 4px 24px;
    opacity: 0.7;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0px 4px 36px;
    border-radius: $border-radius;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    .name {
      display: flex;
      align-items: center;
      white-space: nowrap;

      .menu-icon {
        margin-right: 10px;
        color: #ffffff;
      }

      .dot {
        $size: 4px;
        width: $size;
        height: $size;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }

  .menu-bar-lv2-item[active='true'] {
    opacity: 1;
    font-weight: 600;
  }
}

.menu-bar.isCollapse {
  $bar-width: 80px;
  width: $bar-width;
  flex-shrink: 0;

  .menu-bar-list {
    // 一级菜单
    .menu-bar-lv1 {
      &:hover {
        .menu-bar-lv2-list {
          display: block;
        }
      }

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

      // 二级菜单
      .menu-bar-lv2-list {
        position: absolute;
        z-index: 10;
        left: $bar-width + 8px;
        display: none;
        margin-top: -40px;
        border-radius: 4px;
        animation: menu-show 0.3s;
        transform-origin: left;
        padding: 8px 0px;

        .menu-bar-lv2-item {
          padding: 8px 16px;
          width: 168px;
          margin: 0px;
          border-radius: 0px;

          &:hover ~ .menu-item-list {
            display: block !important;
          }
        }

        .menu-item-list {
          position: absolute;
          left: 178px;
          margin-top: -40px;
          border-radius: 4px;
          animation: menu-show 0.3s;
          transform-origin: left;
          padding: 8px 0px;
          display: none !important;

          .menu-bar-lv3-item {
            padding: 8px 16px;
            width: 168px;
            margin: 0px;
            border-radius: 0px;
          }

          &:hover {
            display: block !important;
          }
        }

        .menu-item-list::before {
          content: ' ';
          display: block;
          width: 20px;
          height: 100%;
          position: absolute;
          left: -20px;
          top: 0px;
        }
      }

      // 用于鼠标移动到二级菜单时，保持HOVER状态
      .menu-bar-lv2-list::before {
        content: ' ';
        display: block;
        width: 20px;
        height: 100%;
        position: absolute;
        left: -20px;
        top: 0px;
      }
    }

    .menu-bar-lv1:hover {
      .menu-bar-lv2-list {
        display: block;
      }
    }
  }
}

.menu-item-bar {
  padding-left: 15px;
}
</style>
