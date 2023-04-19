<template>
  <div
    ref="wrapper"
    :class="className"
    :style="{ height: height, width: width }"
  >
    <div ref="chart" class="vue-chart" />
    <data-adorn
      :is-empty="dataEmpty"
      :is-error="dataError"
      :is-loading="dataLoading"
    />
  </div>
</template>

<script>
import echarts from '../../plugins/echarts'
import chartMixin from '../mixins/chartMixin'
import resize from '../mixins/resize'
import DataAdorn from '../data-adorn/index.vue'

/**
 *  所有其他图表组件的超类
 *  @displayName Super
 */
export default {
  name: 'DashBoardSuper',
  components: {
    DataAdorn
  },
  mixins: [resize, chartMixin],
  props: {
    /**
     * 组件自定义样式
     */
    className: {
      type: String,
      default: 'chart'
    },
    /**
     * 组件宽度
     */
    width: {
      type: String,
      default: '100%'
    },
    /**
     * 组件高度
     */
    height: {
      type: String,
      default: '200px'
    },
    /**
     * 当前展示模式
     */
    mode: {
      type: String,
      default: 'normal',
      validator: function(value) {
        return (
          [
            '', // 容错
            'normal', // 默认模式
            'preview', // 预览模式
            'fullScreen', // 单个图表的全屏模式，数据分析-统计报表-全屏
            'edit', // 编辑模式
            'small', // 展示中心和统计报表模式
            'dialogAdd' // 展示中心弹窗添加模式
          ].indexOf(value) !== -1
        )
      }
    },
    /**
     * 图表数据，与echarts格式一致
     */
    chartData: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 是否自动更新
     */
    isAutoRefresh: {
      type: Boolean,
      default: false
    },
    /**
     * 组件标识，用于获取数据
     */
    id: {
      type: String,
      default: ''
    },
    /**
     * 数据指标，用于实现多个tab
     */
    metricsDes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      renderData: null,
      chart: null,
      dataLoading: false,
      dataError: false,
      dataEmpty: false,
      // 主题相关配置，只读即可
      theme: {}
    }
  },
  computed: {
    clockEnable() {
      // 展示中心和统计报表模式下，可以启动定时器
      return ['small'].includes(this.mode)
    }
  },
  watch: {
    chartData: {
      handler(val) {
        this.render(val)
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.theme = Object.freeze(this.getChartStyle())
    this.colors = this.theme.getColors()
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    async init() {
      if (this.chartData.option) {
        this.initChart()
        this.renderData = this.chartData
        this.render(this.chartData)
      } else {
        const res = await this.fetchData()
        if (res.option.xAxis[0].data) {
          this.initChart()
          this.render(res)
          this.renderData = res
          this.autoRefresh(res)
        } else {
          this.dataEmpty = true
        }
      }
    },

    initChart() {
      if (this.$refs['chart']) {
        this.chart = echarts.init(this.$refs['chart'])
        this.resize()
      }
    },

    // @vuese
    // 渲染图表方法，需要被子类覆盖
    render() {
    },

    // 请求图表数据
    fetchData(metricsDesIdx = 0) {
      this.dataLoading = true
      return new Promise((resolve, reject) => {
        if (!this.$Api) {
          resolve({})
          throw new Error('this.$Api is undefined')
        }
        const metricsDesParams = {}
        for (const [key, value] of Object.entries(
          this.metricsDes[metricsDesIdx] || {}
        )) {
          const k = 'metricsDes.' + key
          !metricsDesParams[k] && (metricsDesParams[k] = value)
        }

        this.$Api()
          .PanelItemController.get_panelItemData.request({
            params: {
              id: this.id,
              ...metricsDesParams
            },
            headers: {
              hideLoading: true,
              hideNotify: true
            }
          })
          .then((res) => {
            if ('focusBtnValue' in this.$parent) {
              this.$set(
                this.$parent.focusBtnValue,
                this.id,
                res.metricsDes[0].xValue.split(',').slice(-1)[0]
              )
            }
            resolve(res)
          })
          .catch((res) => {
            this.dataError = true
            throw new Error('图表加载失败：' + this.id)
          })
          .finally(() => {
            this.dataLoading = false
          })
      })
    },

    resize() {
      if (this.chart) {
        // 调整画布大小
        const width = this.$refs.wrapper.offsetWidth
        const height = this.$refs.wrapper.offsetHeight
        this.chart.resize({ width, height })
      }
    },

    // 主动更新数据
    async getData(metricsDesIdx = 0) {
      const res = await this.fetchData(metricsDesIdx)
      if (res.option.xAxis[0].data) {
        this.render(res)
        this.renderData = res
        this.autoRefresh(res)
      } else {
        this.dataEmpty = true
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.vue-chart {
  height: 100%;
  min-height: 200px;
}
</style>
