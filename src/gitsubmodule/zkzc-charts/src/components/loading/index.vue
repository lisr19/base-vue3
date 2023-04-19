<template>
  <div class="loading">
    <div class="loading-mask"></div>
    <div
        class="loading-cn"
        :style="{width: size+'px', height: size+'px'}">
      <b class="ico"></b>
      <div class="msg">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndex',
  props: {
    size: {
      type: Number,
      default: 80
    },
    isMasking: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
.loading{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  z-index: 9;

  &-cn{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .ico{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: url("./loading.svg") center center no-repeat;
      animation: rotating 2.5s linear infinite;
    }
    .msg{
      position: absolute;
      left: 0;
      top: 0;
      display:flex ;
      width: 100%;
      height: 100%;
      align-items:center;
      justify-content:center;
      background: url("./loading-m.svg") center center no-repeat;
      background-size: 60% 60%;
    }
  }
  &-mask{
    position: relative;
    width: 100%;
    height: 100%;
  }

  @keyframes rotating {
    0%{ transform: rotateZ(0deg); }
    100%{ transform: rotateZ(360deg); }
  }

}
</style>
