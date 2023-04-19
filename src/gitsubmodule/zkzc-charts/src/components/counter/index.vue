<template>
  <div
    ref="counterRef"
    class="counter"
    :class="className"
    :style="{ width: width }"
  >
    <div class="counter-panel">
      <div class="swiper-container" style="width:100%;height:100%">
        <div class="swiper-wrapper">
          <div v-for="(carousel, carouselIndex) in carouselData" :key="carouselIndex" class="swiper-slide">
            <div class="number-list">
              <div class="number-list-row">
                <div
                  v-for="(item, index) in carousel"
                  :key="`${carouselIndex}-${index}`"
                  ref="colRef"
                  class="number-list-col"
                >
                  <div class="number-item">
                    <div class="number-item-title">{{ item.name }}</div>
                    <div class="number-item-val">
                      <countTo
                        :start-val="0"
                        :decimals="decimals(item.value)"
                        :end-val="item.value"
                        :duration="2600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="carouselData.length>1" class="swiper-button-prev carousel__arrow" />
      <div v-show="carouselData.length>1" class="swiper-button-next carousel__arrow" />
    </div>
    <data-adorn
      :is-empty="dataEmpty"
      :is-error="dataError"
      :is-loading="dataLoading"
    />
  </div>
</template>

<script>
import Super from '../super/index.vue'
import DataAdorn from '../data-adorn/index.vue'
import { CountTo } from 'vue3-count-to'
import Swiper from 'swiper' // 引入库
import 'swiper/css/swiper.css'

/**
 * 计数器 - 条状计数器
 */
export default {
  name: 'CounterIndex',
  components: {
    DataAdorn,
    CountTo
  },
  extends: Super,
  props: {
    /**
     * 是否自动翻页
     */
    autoScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 重组轮播图里面的数据
      carouselData: [],
      pageInterval: 0,
      numInterval: 0,
      pageSize: 6

    }
  },
  computed: {

  },
  created() {
    this.pageInterval = this.theme.counter.pageInterval
    this.numInterval = this.theme.counter.countToDuration
  },
  mounted() {

  },
  methods: {
    initChart() {
      // 覆盖基类
    },
    render(data) {
      const seriesData = data.option.series[0].data
      let arr = []
      const carouselData = []

      seriesData.forEach((item, index) => {
        const itemFormat = Object.assign({}, item, {
          value: Number.parseFloat(item.value)
        })
        arr.push(itemFormat)
        if ((index + 1) % this.pageSize === 0) {
          // 满6个数据就一屏轮播图
          carouselData.push(arr)
          arr = []
        }
        if (arr.length > 0 && index === seriesData.length - 1) {
          // 不满9个余不尽的时候
          carouselData.push(arr)
        }
      })
      this.carouselData = carouselData

      this.$nextTick(() => {
        this.rerender()
        new Swiper('.swiper-container', {
          slidesPerView: '1',
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            autoplayDisableOnInteraction: false
          },
          loop: false,
          // 设置前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }

        })
      })
    },
    // 计算每屏可排列的计数器数量，并重新渲染
    rerender() {
      if (this.$refs.colRef?.length) {
        const counterRefHeight = this.$refs.counterRef?.offsetHeight
        const colRefHeight = this.$refs.colRef[0]?.$el?.offsetHeight
        if (counterRefHeight && colRefHeight) {
          const pageSize = Math.floor(counterRefHeight / colRefHeight) * 2
          if (this.pageSize !== pageSize) {
            this.pageSize = pageSize
            this.render(this.renderData)
          }
        }
      }
    },
    resize() {
      this.rerender()
    },
    decimals(endVal) {
      const str = endVal ? String(endVal) : ''
      return str.split('.')[1] ? str.split('.')[1].length : 0
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.counter {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  padding: 0px 2px;
  font-size: 12px;
  overflow: hidden;
  color: #444;

  .counter-panel {
    position: relative;
    height: 100%;
    font-weight: bold;

    :deep(.el-carousel) {
      position: relative;
      height: 100%;
    }

    .card-panel-text {
      font-weight: normal;
      margin-bottom: 50px;

      h4 {
        min-height: 30px;
        font-weight: normal;
        font-size: 24px;
        color: #333;
      }
      .sub {
        font-size: 16px;
        color: #999;
        padding-left: 10px;
      }
    }
  }
  .number-list {
    width: 100%;
    margin-top: 16px;
    padding: 0 10px;
    box-sizing: border-box;
    &-row{
      margin-left: -10px;
      margin-right: -10px;
      box-sizing: border-box;
    }
    &-col{
      width: 50%;
      padding-left: 10px;
      padding-right: 10px;
      float: left;
      box-sizing: border-box;
    }
  }
  .number-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &::before {
      content: "";
      height: 100%;
      width: 1px;
      background-color: #f6f6f6;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 10px;
    }

    &-title {
      font-weight: normal;
      font-size: 14px;
      overflow: hidden;
      color: #4b5869;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-val {
      position: relative;
      font-weight: bold;
      color: #0c1014;
      font-size: 28px;
      letter-spacing: 0.05em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      z-index: 2;
    }
  }
}
.update-time-box {
  font-size: 12px;
  color: #999eb1;
  margin-bottom: 20px;
  padding-left: 10px;
  .sub {
    margin: 0;
  }
}
@media only screen and (max-width: 1366px) {
  .card-panel {
    .number-item-title {
      font-size: 12px;
    }
    .counter-panel {
      .card-panel-num {
        font-size: 22px;
      }
    }
  }
}
.carousel__arrow{
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  height: 36px;
  width: 36px;
  cursor: pointer;
  transition: .3s;
  border-radius: 50%;
  background-color: rgba(31,45,61,.11);
  color: #fff;
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  text-align: center;
  font-size: 12px;

  &::after{
    font-size: initial;
  }
}
</style>

