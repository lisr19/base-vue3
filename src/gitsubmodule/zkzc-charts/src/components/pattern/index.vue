<template>
  <div class="stripe scroller">
    <div class="swiper-container" style="width:100%;height:100%">
      <div class="swiper-wrapper">
        <div v-for="(car,carIndex) in carouseData.chartData" :key="carIndex" class="swiper-slide">
          <div
            v-for="(item, index) in car"
            :key="index"
            class="stripe-carousel-item"
          >
            <div class="device-item-div">
              <div>
                <span class="device-item">{{ item.x }}</span>
              </div>
              <div class="device-number-div">
                <span
                  class="device-number"
                >{{ item.number }} / {{ item.total }}</span>
              </div>
            </div>
            <div class="linear-base-bar">
              <div
                class="stripe-line"
                :style="`width: ${
                  item.par
                }%;background-image: linear-gradient(to right, ${hexToRgba(
                  color,
                  0.1
                )}, ${hexToRgba(color, 0.8)});`"
              />
              <div
                v-show="item.par >= 1"
                class="stripe-line-last"
                :style="`left: calc(${item.par}% - 10px);border-color: ${hexToRgba(
                  color,
                  0.8
                )};`"
              >
                <div
                  class="stripe-line-last-breath"
                  :style="`background:-webkit-gradient(radial,9 9,0,9 9,9,from(${hexToRgba(
                    color,
                    0.4
                  )}),to(${hexToRgba(color, 0.1)}));`"
                />
              </div>
              <div
                class="stripe-line-last-center"
                :style="`left: calc(${
                  item.par
                }% - 2px);background-color: ${hexToRgba(color, 1, 40)};`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="carouseData.chartData.length>1" class="swiper-button-prev carousel__arrow" />
    <div v-show="carouseData.chartData.length>1" class="swiper-button-next carousel__arrow" />
    <data-adorn
      :is-empty="dataEmpty"
      :is-error="dataError"
      :is-loading="dataLoading"
    />
  </div>
</template>

<script>
import Super from '../super/index.vue'
import { hexToRgba } from '../../utils/tools'
import DataAdorn from '../data-adorn/index.vue'
import Swiper from 'swiper' // 引入库
import 'swiper/css/swiper.css'
/**
 * 条纹图
 */
export default {
  name: 'PatternIndex',
  components: {
    DataAdorn
  },
  extends: Super,
  props: {
    /**
     * 每页数据量
     */
    pageSize: {
      type: Number,
      default: 4
    },
    /**
     * 是否自动翻页|滚动
     */
    autoScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 重组轮播图里面的数据
      carouseData: {
        chartData: []
      },
      pageInterval: 0,
      color: null
    }
  },
  computed: {

    swiperOption() {
      return {
        // slidesPerView: 1,
        // 设置分页器
        pagination: {
          el: '.swiper-pagination',
          // 设置点击可切换
          clickable: true
        },
        // 设置前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        slidesPerView: '1',
        autoplay: this.autoScroll ? {
          delay: this.pageInterval,
          disableOnInteraction: false,
          autoplayDisableOnInteraction: false
        } : this.autoScroll,
        loop: false
      }
    }
  },
  created() {
    const { theme } = this
    const color = theme.getColors()[0]
    this.color = color

    this.pageInterval = theme.counter.pageInterval
  },
  mounted() {},
  methods: {
    hexToRgba,
    initChart() {
      // 覆盖基类
    },
    render(data) {
      if (!data || !data.option) {
        return
      }
      const { option } = data

      if (option.xAxis && option.xAxis.length && option.xAxis[0].data) {
        const data = option.xAxis[0].data.map((item, index) => {
          const y = option.series[0].data[index]
          const total = parseInt(y.split('/')[1]) || 0
          const number = parseInt(y.split('/')[0]) || 0
          const par = number === 0 || total === 0 ? 0 : parseFloat((number / total) * 100).toFixed('2')
          return {
            x: item,
            total,
            number,
            par
          }
        })
        // 转成pageSize个一个轮播图
        let arr = []
        const carouselData = []
        data.forEach((item, index) => {
          arr.push(item)
          if ((index + 1) % this.pageSize === 0) {
            // 满pageSize个数据就一屏轮播图
            carouselData.push(arr)
            arr = []
          }
          if (arr.length > 0 && index === data.length - 1) {
            // 不满pageSize个余不尽的时候
            carouselData.push(arr)
          }
        })
        this.carouseData.chartData = carouselData
      }
      this.$nextTick(() => {
        new Swiper('.swiper-container', {
          slidesPerView: '1',
          autoplay: this.autoScroll ? {
            delay: this.pageInterval,
            disableOnInteraction: false,
            autoplayDisableOnInteraction: false
          } : this.autoScroll,
          loop: false,
          // 设置前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }

        })
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.stripe {
  position: relative;
  height: 200px;
  overflow: auto;

  .stripe-container {
    padding: 0 10px;
    height: 100%;
  }

  .device-item {
    font-size: 14px;
    font-weight: 500;
    color: #666;
  }

  .device-number {
    font-size: 14px;
    font-weight: 500;
    color: #666;
  }

  .linear-base-bar {
    position: relative;
    width: 100%;
    height: 6px;
    background-color: #e9e9e9;
    border-radius: 3px;

    .stripe-line {
      position: relative;
      height: 6px;
      border-radius: 3px;
    }

    .stripe-line-last-center {
      position: absolute;
      top: -1px;
      width: 8px;
      height: 8px;
      border-radius: 5px;
    }

    .stripe-line-last {
      position: absolute;
      top: -8.5px;
      width: 22px;
      height: 22px;
      border: 1px solid;
      border-radius: 12px;

      @include breathing;

      .stripe-line-last-breath {
        position: absolute;
        top: 1px;
        left: 1px;
        width: 18px;
        height: 18px;
        border-radius: 9px;

        @include breathing;
      }
    }
  }

  .stripe-carousel-item {
    margin: 8px 10px 0;

    .device-item-div {
      margin: 2px 0 8px;
      width: 100%;

      div {
        display: inline-block;
      }
    }

    .device-number-div {
      display: inline-block;
      float: right;
    }
  }
}

.stripe-container :deep(.el-carousel__container .el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.1);
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
