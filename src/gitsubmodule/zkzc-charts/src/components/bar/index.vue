<script>
import Super from '../super/index.vue'
import { toArray } from '../../utils/tools'

/**
 * 柱状图-默认外观
 */
export default {
  name: 'BarIndex',
  components: {},
  extends: Super,
  props: {
    /**
     * 圆柱宽度
     */
    barW: {
      type: Number,
      default: 'auto'
    },
    /**
     * 圆柱之间缝隙 / 圆柱宽度
     */
    gapWP: {
      type: Number,
      default: 0.5
    }
  },
  data() {
    return {
      colors: [] // 配色方案
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

      const { theme, barW, gapWP } = this

      return series.map((item, index) => {
        const color = this.colors[index % this.colors.length]
        return {
          ...theme.series.bar,
          type: 'bar',
          name: item.name,
          data: item.data,
          itemStyle: {
            color: theme.enhanceColor(color)
          },
          barWidth: barW,
          barGap: gapWP
          // dataZoom: [{
          //   type: 'slider',
          //   start: 50,
          //   end: 100
          // },
          // {
          //   type: 'inside',
          //   start: 50,
          //   end: 100
          // }] //无效
        }
      })
    }
  }

}
</script>

<style lang="scss" type="text/scss">

</style>
