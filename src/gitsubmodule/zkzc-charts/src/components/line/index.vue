<script>
import Super from '../super/index.vue'
import { toArray } from '../../utils/tools'
/**
 * 折线图 - 默认外观
 */
export default {
  name: 'LineIndex',
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
          data: legend.data
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
          color,
          lineStyle: {
            ...theme.series.line.lineStyle,
            shadowBlur: 5,
            shadowOffsetX: 5,
            shadowOffsetY: 5
          },
          itemStyle: {
            ...theme.series.line.itemStyle,
            color
          },
          symbolSize: 8,
          type: 'line',
          smooth: true,
          name: item.name,
          data: item.data
        }
      })
    }

  }
}
</script>

<style lang="scss" type="text/scss">

</style>
