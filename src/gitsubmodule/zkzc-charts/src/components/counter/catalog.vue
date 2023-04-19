<template>
  <div class="catalog">
    <div class="swiper-container" style="width:100%;height:100%">
      <div class="swiper-wrapper">
        <div v-for="(car,index) in carouselData" :key="index" class="swiper-slide" :style="cssVars">
          <div
            v-for="(item,carIndex) in car"
            :key="carIndex"
            :span="colSpan"
            class="counter-div"
          >
            <div class="count-icon">
              <div class="count-inner-ring">
                <!-- 旋转的图片 -->
                <img
                  src="../../static/img/catalog/counterInnerRing.svg"
                  class="count-inner-ringsvg"
                >
              </div>
              <div class="count-icon-inner-svg">
                <!-- 里面可替换的图片 -->
                <slot name="iconImg">
                  <img
                    :src="item.url?item.url:require(`../../static/img/catalog/${getIconFile(item.icon)}`)"
                    class="count-icon-svg"
                  >
                </slot>

              <!-- <svg-icon
                :name="item.icon?item.icon:'countDefault'"
                class="count-icon-svg"
              /> -->
              </div>
            </div>
            <div class="count-text">
              <div class="count-name">{{ item.name }}</div>
              <div class="count-number-div">
                <div class="count-number">
                  <countTo
                    v-show="item.value>9"
                    :start-val="0"
                    :end-val="item.value"
                    :duration="theme.counter.countToDuration"
                  />
                  <span v-show="item.value<=9">{{ `0${item.value}` }}</span>
                </div>
                <div
                  v-if="item.unit"
                  class="count-number-unit"
                >
                  {{ item.unit }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="carouselData.length>1" class="swiper-button-prev carousel__arrow" />
    <div v-show="carouselData.length>1" class="swiper-button-next carousel__arrow" />
    <data-adorn :is-empty="dataEmpty" :is-error="dataError" :is-loading="dataLoading" />
  </div>
</template>

<script>
import Super from '../super/index.vue'
import DataAdorn from '../data-adorn/index.vue'
import { CountTo } from 'vue3-count-to'
import Swiper from 'swiper' // 引入库
import 'swiper/css/swiper.css'
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.min.css'

/**
 *  @group Counter
 *  图标计数器
 */
export default {
  name: 'CounterCatalog',
  components: {
    DataAdorn,
    CountTo
    // Swiper,
    // SwiperSlide
  },
  extends: Super,
  props: {
    /**
     * 是否自动翻页
     */
    autoScroll: {
      type: Boolean,
      default: true
    },
    /**
     * 每页行数
     */
    rows: {
      type: Number,
      default: 3
    },
    /**
     * 每页列数
     */
    cols: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      carouselData: []
    }
  },
  computed: {
    cssVars() {
      return {
        '--widthCol': 100 / this.cols + '%'
      }
    },
    colSpan() {
      return 24 / this.cols
    }
  },

  created() {
  },
  mounted() {

  },
  methods: {
    // getImageUrl(url) {
    //   return new URL(url, import.meta.url).href
    // },
    getIconFile(icon) {
      if (!icon) {
        return 'countDefault.svg'
      }

      return icon
    },
    initChart() {
      // 覆盖基类
    },
    render(data) {
      if (!data || !data.option) {
        return
      }
      const { cols, rows } = this
      let arr = []
      const carouselData = []
      const pageSize = cols * rows
      const seriesData = data.option.series[0].data

      seriesData.forEach((item, index) => {
        const itemFormat = Object.assign({}, item, {
          value: Number.parseFloat(item.value)
        })
        arr.push(itemFormat)
        if ((index + 1) % pageSize === 0) {
          // 满pageSize个数据就一屏轮播图
          carouselData.push(arr)
          arr = []
        }
        if ((arr.length > 0) && (index === seriesData.length - 1)) {
          // 不满pageSize个余不尽的时候
          carouselData.push(arr)
        }
      })

      this.carouselData = carouselData
      this.$nextTick(() => {
        new Swiper('.swiper-container', {
          slidesPerView: '1',
          autoplay: this.autoScroll ? {
            delay: this.theme.counter.pageInterval,
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
.catalog {
  position: relative;
  height:100%;
  min-height: 200px;

  .counter-container {
    padding: 0;
    height: 100%;
    .el-carousel__item {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .counter-row{
    margin-left: -10px;
    margin-right: -10px;
    box-sizing: border-box;
  }
  .counter-div {
    display: flex;
    padding: 5px 10px 5px 10px;
    width: var(--widthCol);
    float: left;
    box-sizing: border-box;
  }

  .count-icon {
    position: relative;
    width: 50px;
    height: 50px;
    border: 1px solid #33AEE6;
    border-radius: 25px;
    flex-shrink: 0;

    .count-inner-ring {
      position: absolute;
      top:0;
      left: 0;
      width: 50px;
      height: 50px;
      box-sizing: border-box;
      background: radial-gradient(circle, rgba(51, 174, 230, 0.6) 0, transparent 40%);

      .count-inner-ringsvg {
        width: 50px;
        height: 50px;
        @include rotating($duration: 3s);
      }
    }
    .count-icon-inner-svg {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;

      .count-icon-svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  .count-text {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .count-name {
      font-size: 14px;
      color: #666;
    }

    .count-number-div {
      display: flex;
      margin-top: 5px;

      .count-number {
        height: 100%;
        font-size: 28px;
        font-weight: bold;
        line-height: 100%;
        color: #666;
      }

      .count-number-unit {
        margin-left: 5px;
        height: 22px;
        font-size: 16px;
        color: #ced9ff;
        align-self: end;
        line-height: 22px;
      }
    }
  }

  .counter-container :deep(.el-carousel__container .el-carousel__arrow) {
    background-color: rgba(255, 255, 255, 0.1);
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
