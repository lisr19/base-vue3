<template>
  <div class="cover-page background-color" v-bind:class="{ out: isOut }">
    <div class="title">
      <div class="title-default">
        <div class="icon page-color" @click="back">
          <img src="@/assets/icons/svg/return-btn.svg" />
        </div>
        <label class="title-text">{{ title }}</label>
      </div>
      <slot name="titleBar" />
    </div>
    <div class="body page-color" :style="cpStyle">
      <slot name="contentSlot"/>
    </div>
    <div />
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps({
    title:{
        type:String
    },
    cpStyle:{
        type:Object
    }
})

const isOut = ref(false)
const isIn = ref(false)
const emits = defineEmits(['back'])

const back = () => {
    isOut.value = true
    setTimeout(() => {
    emits('back')
    }, 300)
}

</script>
<style lang="scss" scoped>
@keyframes in {
  0% {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0%);
    transform: translateX(0%);
    opacity: 1;
  }
}
@keyframes out {
  0% {
    -webkit-transform: translateX(0%);
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    opacity: 0;
  }
}
.cover-page {
//   position: absolute;
//   left: 0px;
//   top: 0px;
  width: 100%;
  height: 100%;
  margin: 24px;
//   padding: 3 * $margin-size;
//   z-index: 10;
//   opacity: 0;
//   animation: in 0.5s 1s forwards;

  .title {
    display: flex;
    margin-bottom: 2 * $margin-size;
    align-items: center;
    .title-default {
      display: flex;
      align-items: center;
      .icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .title-text {
        font-size: 20px;
        font-weight: 500;
        margin: 0px 2 * $margin-size;
      }
    }
  }
  .body {
    height: calc(100% - 36px - 16px);
    padding: 2 * $margin-size;
    overflow: auto;
  }
}
.cover-page.out {
  animation: out 0.3s forwards;
}
</style>
