<template>
  <!-- 导航栏 -->
  <div class="navbar bar">
    <div class="control">
      <el-button
          class="barButton smallButton"
          @click="move(1)"
          link
          v-if="!scrollType[0]"
      >
        <el-icon>
          <ArrowLeft/>
        </el-icon>
      </el-button>
    </div>
    <div class="barList" ref="barListRef">
      <el-button
          v-for="(item, index) in barList"
          :key="item.name"
          @click="goRouter(item, index)"
          :id="`barItem${index}`"
          class="barButton border-color-1"
          :class="index === curBar ? 'active background-color font-color-main' : 'font-color-default'"
          :title="menuData[item.path]"
      >
        <div class="active-line r-b-background-color" v-if="index === curBar"/>
        {{ menuData[item.path] }}
        <el-icon
            @click="remove(index)"
            v-if="barList.length > 1"
        >
          <Close/>
        </el-icon>
      </el-button>
    </div>
    <div class="control">
      <el-button
          class="barButton smallButton"
          @click="closeOthers"
          title="关闭其他"
          link
          v-if="barList.length>1"
      >
        <el-icon>
          <Close/>
        </el-icon>
      </el-button>
    </div>
    <div class="control">
      <el-button
          link
          class="barButton smallButton"
          @click="move(0)"
          v-if="!scrollType[1]"
      >
        <el-icon>
          <ArrowRight/>
        </el-icon>
      </el-button>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive, nextTick, computed} from "vue";
import {auth} from '@/utils/dgySdk'
// init
let curBar = ref(0)
let barList = reactive([])
let scrollType = ref([true, true]) // 是否要向左滚动，是否要向右滚动
const barListRef = ref(null)

// 判断路由，控制当前导航标签
let route = useRoute()
let router = useRouter()
watch(() => route.path, (newValue) => {
  // 滚动页面后跳转路由，回归最顶部
  window.scrollTo(0, 0)
  nextTick(() => {
    setRouter(route)
  })
}, { immediate: true })
const menuData = computed(() => {
  let menuData = auth.menuAuth()
  let result = {}
  let getResult = (data) => {
    data.forEach((v) => {
      if (!result[v.path]) {
        result[v.path] = v.name
      }
      if (v.children) {
        getResult(v.children)
      }
    })
  }
  getResult(menuData)
  return result
})

// methods
const setRouter = async (item) => {
  item = JSON.parse(JSON.stringify(item))
  let barListIndex = barList.findIndex(v => v.path === item.path)
  if (barListIndex < 0) {
    barList.push(item)
    curBar.value = barList.length - 1
    await nextTick()
    move(0)
  } else {
    curBar.value = barListIndex
  }
}
const remove = (index) => {
  barList.splice(index, 1)
  // 如果删除的标签在当前标签左边
  if (index < curBar.value) {
    curBar.value--
  }
  // 如果删除当前标签
  else if (curBar.value === index) {
    if (curBar.value >= barList.length) {
      curBar.value--
    }
    goRouter(barList[curBar.value], index - 1)
  }
}
const move = async (side) => {
  // 0,左，1，右
  let barList = barListRef.value
  let scrollStep = barList.offsetWidth * 0.8
  let endDist = barList.scrollLeft + (side ? -scrollStep : scrollStep)
  scrollTo(endDist)
}
// 滚动动画
const scrollTo = (endDist) => {
  let barList = barListRef.value
  let side = endDist - barList.scrollLeft < 0
  let scrollDist = barList.scrollLeft
  let scrollStep = () => {
    setTimeout(() => {
      let step = 6
      scrollDist += side ? -step : step
      barList.scroll(scrollDist, 0)
      if (side ? scrollDist <= endDist : scrollDist >= endDist) {
        setScrollType()
      } else {
        scrollStep()
      }
    }, 10)
  }
  scrollStep()
}
const setScrollType = async () => {
  await nextTick()
  let barList = barListRef.value
  scrollType.value = [
    barList.scrollLeft === 0,
    barList.scrollLeft + barList.offsetWidth === barList.scrollWidth
  ]
}
const goRouter = (item, index) => {
  router.push(item.path)
  let itemDom = document.getElementById(`barItem${index}`)
  let barList = barListRef.value
  if (itemDom.offsetLeft < barList.scrollLeft) {
    scrollTo(itemDom.offsetLeft)
  } else if (
      itemDom.offsetLeft + itemDom.offsetWidth >
      barList.scrollLeft + barList.offsetWidth
  ) {
    scrollTo(itemDom.offsetLeft + itemDom.offsetWidth)
  } else {
    setScrollType()
  }
}
const closeOthers = () => {
  let cur = barList[curBar.value]
  barList = [cur]
  curBar.value = 0
  setScrollType()
}

</script>
<style lang="scss" scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.bar {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-end;

  .control {
    width: 40px;
    padding: 0px 2px;
    top: 2px;
    position: relative;
    box-sizing: border-box;
    flex-shrink: 0;
    height: 43px;
    line-height: 43px;
  }

  .barList {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    padding: 0px $margin-size;
    position: relative;
    // top: 4px;
    .barButton + .barButton {
      margin-left: $margin-size;
    }
    >.barButton {
        height: 43px;
        line-height: 43px;
        padding: 14px 24px;
    }
  }

  .barButton {
    margin-right: -1px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-bottom-width: 0px;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    position: relative;
    opacity: 0;
    animation: fade-in 1s forwards;

    .active-line {
      position: absolute;
      width: 100%;
      height: 3px;
      left: 0px;
      top: -1px;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    i {
      margin: 0 2px;
    }
  }

  .active::after {
    content: "";
    width: 100%;
    height: 4px;
    background-color: inherit;
    position: absolute;
    left: 0px;
    bottom: -4px;
  }

  .barButton + .barButton {
    margin-left: $margin-size;
  }

  .barButton + .barButton {
    margin: 0px;
    margin-right: -1px;
  }

  .active:hover {
    border-bottom-color: #fff;
  }

  .smallButton {
    padding: 8px;
    margin: 2px;
    border-bottom-width: 1px;
    border: none;
    border-radius: $border-radius;
    font-weight: 900;
    padding-bottom: 12px;
  }
}
</style>
