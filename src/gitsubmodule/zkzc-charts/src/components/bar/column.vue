<script>
import echarts from '../../plugins/echarts'
import Super from '../super/index.vue'
import { hexToRgba, toArray } from '../../utils/tools'
/**
 *  柱状图-圆柱
 */
export default {
  name: 'BarColumn',
  components: {},
  extends: Super,
  props: {
    /**
     * 圆柱宽度
     */
    barW: {
      type: Number,
      default: 20
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
  async mounted() {
    await this.init()
    this.initInteract()
  },
  beforeDestroy() {
    this.removeInteract()
  },
  methods: {

    initInteract() {
      const t = this

      if (this.chart) {
        this.chart.off('legendselectchanged')
        this.chart.on('legendselectchanged', () => {
          const { series } = t.chartData.option
          const { legend } = t.chart.getOption()

          t.chart.setOption({
            series: t.getSeries(series, legend)
          })
        })
        this.chart.on('mouseover', () => {
          const { dataZoom } = t.chart.getOption()
          if (dataZoom[0]) {
            dataZoom[0].show = true
          }
          this.chart.setOption({ dataZoom })
        })
        this.chart.on('globalout', () => {
          const { dataZoom } = t.chart.getOption()
          if (dataZoom[0]) {
            dataZoom[0].show = false
          }
          this.chart.setOption({ dataZoom })
        })
      }
    },
    removeInteract() {
      if (this.chart) {
        this.chart.off('legendselectchanged')
        this.chart.off('mouseover')
        this.chart.off('globalout')
      }
    },
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
        animation: false,
        xAxis: {
          ...xAxis[0],
          ...theme.xAxis
        },
        yAxis: {
          ...yAxis[0],
          ...theme.yAxis
        },
        series: this.getSeries(series, legend),
        dataZoom: this.getDataZoom(series)
      }, {
        replaceMerge: ['series'] // 有新series时不合并
      })
    },

    // 根据数据的长度,配置对应的滚动条
    getDataZoom(series) {
      const { barW, gapWP } = this
      const ratio = (this.$refs['chart'].clientWidth * 100 / (series.length * (1 + gapWP) * barW * series[0].data.length * 2)).toFixed(0)

      if (ratio > 100) {
        return []
      } else {
        return { ...this.theme.dataZoom, end: Math.max(10, ratio) }
      }
    },

    // 计算指定索引的圆柱的位置
    getColPosition(len, index) {
      const { barW, gapWP } = this
      // 偏移归0 + 宽度/2 + (宽度+间隙) * index
      return 0.5 * (-barW * len + (1 - len) * gapWP * barW) + 0.5 * barW + index * (1 + gapWP) * barW
    },

    getSeries(series, legend) {
      series = toArray(series)
      legend = toArray(legend)

      const { barW, gapWP, theme } = this
      let res = []

      // 过滤掉隐藏的series
      const legendSelected = legend[0].selected || {}
      series = series.filter(v => {
        return legendSelected[v.name] === undefined ? true : legendSelected[v.name]
      })
      const len = series.length

      series.forEach((item, index) => {
        const color = this.colors[index % this.colors.length]
        const xpos = this.getColPosition(len, index)

        res = [
          ...res,
          ...[
            {
              barWidth: barW,
              barGap: '-100%',
              name: item.name,
              type: 'pictorialBar',
              symbolSize: [barW, 10],
              symbolOffset: [xpos, -5], // 上部椭圆
              symbolPosition: 'end',
              z: 12,
              color,
              data: item.data
            },
            {
              barWidth: barW,
              barGap: '-100%',
              name: item.name,
              type: 'pictorialBar',
              symbolSize: [barW, 10],
              symbolOffset: [xpos, 5], // 下部椭圆
              symbolPosition: 'start',
              z: 12,
              color: hexToRgba(color, 0.3),
              data: item.data
            },
            {
              name: item.name,
              type: 'bar',
              barWidth: barW,
              barGap: gapWP,
              label: {
                ...theme.series.bar.label,
                padding: [0, 0, 10, 0]
              },
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                  {
                    offset: 0,
                    color: hexToRgba(color, 0.9)
                  },
                  {
                    offset: 1,
                    color: hexToRgba(color, 0.2)
                  }
                ])
              },
              data: item.data
            }
          ]
        ]
      })

      return res
    }
  }
}
</script>

<style lang="scss" type="text/scss">

</style>
