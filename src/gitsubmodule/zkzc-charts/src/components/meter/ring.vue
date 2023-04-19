<template>
  <div class="meter-ring" :style="{height:height,width:width}">
    <div class="ring-bg" :style="{transform: `translate(-50%, -50%) scale(${size})`}" />
    <div class="meter-ring-wrap" :style="{transform: `translate(-50%, -50%) scale(${size})`}">
      <div class="ring-main">
        <svg-ring :has-blur="theme.meter.ring.hasBlur" />
      </div>
      <div class="ring-text">
        <div class="ring-text-title" :style="{color: theme.textStyle.color}">
          <count-to
            :start-val="0"
            :end-val="title.value"
            :decimals="2"
            :suffix="title.suffix"
            :duration="theme.counter.countToDuration"
          />
        </div>
        <div class="ring-text-detail" :style="{color: theme.textStyle.color}">{{ subTitle.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Super from '../super/index.vue'
import SvgRing from './svg-ring.vue'
import { CountTo } from 'vue3-count-to'

export default {
  name: 'MeterRing',
  components: {
    CountTo,
    SvgRing
  },
  extends: Super,
  props: {
  },
  data() {
    return {
      title: {},
      subTitle: {},
      size: 1
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { clientWidth, clientHeight } = this.$el
      this.size = Math.max(1, Math.min(clientWidth, clientHeight) / 250)
    })
  },
  methods: {

    init() {
      try {
        if (this.chartData.option.series && this.chartData.option.series.length > 0) {
          // 使用series的数据
          const { data, name, suffix } = this.chartData.option.series[0]
          this.title = { value: data[0], suffix }
          this.subTitle = { value: name }
        } else {
          // 使用标题数据
          const { value, suffix } = this.chartData.option.title
          const subTitle = this.chartData.option.subTitle.value
          this.title = { value, suffix }
          this.subTitle = { value: subTitle }
        }
      } catch (err) {
        console.error(err)
      }
    }

  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.meter-ring {
  position: relative;
  min-height: 200px;

  &-wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250px;
    aspect-ratio: 12/7;
    background-size: 100% 100%;
  }

  .ring-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250px;
    aspect-ratio: 12/7;
    mix-blend-mode: screen;
    background: url('./ring-bg.webp') center center no-repeat;
    background-size: 100% 100%;

    video {
      width: 100%;
      height: 100%;
    }
  }

  .ring-main {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 160%;
    transform: translate3d(-50%, -50%, 0) rotateX(-65deg);
    text-align: center;
  }

  .ring-text {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -90%);
    display: flex;
    align-items: center;
    flex-direction: column;

    &-title {
      font-size: 32px;
      font-weight: bold;
    }

    &-detail {
      font-size: 14px;
    }
  }
}
</style>
