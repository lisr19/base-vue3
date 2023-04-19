<script>
import Super from '../super/index.vue'
import { toArray } from '../../utils/tools'

/**
 * 折线图 - 面积图
 */
export default {
  name: 'LineArea',
  components: {},
  extends: Super,
  data() {
    return {}
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
        tooltip: theme.tooltip,
        legend: {
          ...theme.legend,
          data: legend.data,
          icon: 'rect'
        },
        xAxis: {
          ...xAxis[0],
          ...theme.xAxis
        },
        yAxis: {
          ...yAxis[0],
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

        return {
          ...theme.series.line,
          lineStyle: {
            color
          },
          itemStyle: {
            color
          },
          type: 'line',
          smooth: false,
          name: item.name,
          data: item.data,
          areaStyle: {
            opacity: 0.8,
            color: theme.enhanceColor(color)
          }
        }
      })
    }

  }
}
</script>

<style lang="scss" type="text/scss">

</style>
