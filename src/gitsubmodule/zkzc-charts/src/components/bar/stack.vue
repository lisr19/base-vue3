<script>
import echarts from '../../plugins/echarts'
import Super from '../super/index.vue'
import { hexToRgba, toArray } from '../../utils/tools'
/**
 * @group Bar
 * 堆叠图
 */
export default {
  name: 'BarStack',
  components: {},
  extends: Super,
  props: {
    /**
     * 内容展示方向
     */
    direction: {
      type: String,
      default: 'horizontal',
      validator(value) {
        return ['horizontal', 'vertical'].includes(value)
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    isHoriz() {
      return this.direction === 'vertical'
    }
  },
  mounted() {
  },
  methods: {
    render(data) {
      if (!data || !data.option) {
        return
      }
      const { legend, series, xAxis, yAxis } = data.option
      const { theme } = this

      this.chart.setOption({
        textStyle: theme.textStyle,
        grid: theme.grid,
        tooltip: {
          ...theme.tooltip
        },
        legend: {
          ...theme.legend,
          data: legend.data,
          icon: 'rect'
        },
        xAxis: {
          ...(this.isHoriz ? yAxis[0] : xAxis[0]),
          ...theme.xAxis
        },
        yAxis: {
          ...(this.isHoriz ? xAxis[0] : yAxis[0]),
          ...theme.yAxis
        },
        series: this.getSeries(series)
      }, {
        notMerge: true // 有新series时不合并
      })
    },

    getSeries(series) {
      series = toArray(series)

      const { theme } = this

      return series.map((item, index) => {
        const color = this.colors[index % this.colors.length]

        const colorLinear = this.isHoriz
          ? new echarts.graphic.LinearGradient(
            1, 0, 0, 0,
            [
              { offset: 0, color: hexToRgba(color, 0.9) },
              // { offset: 0.3, color: hexToRgba(color, 0.5) },
              { offset: 1, color: hexToRgba(color, 0.5) }
            ]
          )
          : new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 0, color: hexToRgba(color, 0.9) },
              // { offset: 0.3, color: hexToRgba(color, 0.5) },
              { offset: 1, color: hexToRgba(color, 0.5) }
            ]
          )

        return {
          ...theme.series.bar,
          type: 'bar',
          stack: 'a1',
          name: item.name,
          data: item.data,
          barWidth: this.isHoriz ? '50%' : '30%',
          barMinWidth: 5,
          barMinHeight: 0,
          itemStyle: {
            color: colorLinear
            // color: hexToRgba(color, 0.8)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss">

</style>
