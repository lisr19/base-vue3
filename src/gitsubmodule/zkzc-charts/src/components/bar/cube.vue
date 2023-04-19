<script>
import echarts from '../../plugins/echarts'
import Super from '../super/index.vue'
import { hexToRgba, toArray } from '../../utils/tools'
/**
 * 柱状图-立方体
 */
export default {
  name: 'BarCube',
  components: {},
  extends: Super,
  props: {
    /**
     * 柱宽度
     */
    barW: {
      type: Number,
      default: 30
    },
    /**
     * 柱之间缝隙 与 柱宽度 的比值
     */
    gapWP: {
      type: Number,
      default: 1
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
        // 图例选择改变时重新选人series
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
          dataZoom[0] && (dataZoom[0].show = true)
          this.chart.setOption({ dataZoom })
        })
        this.chart.on('globalout', () => {
          const { dataZoom } = t.chart.getOption()
          dataZoom[0] && (dataZoom[0].show = false)
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

    initChart() {
      this.chart = echarts.init(this.$refs['chart'])
      // 调整画布大小
      const width = this.$refs.wrapper.offsetWidth
      let height = this.$refs.wrapper.offsetHeight
      this.chart.resize({ width, height })
      this.initChartRegister()
    },

    render(data) {
      if (!data || !data.option) {
        return
      }
      const { legend, series, xAxis, yAxis } = data.option
      const { theme } = this

      const newSeries = [{ ...series[0] }, { ...series[0] }]
      newSeries[1].name += '1'

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
        series: this.getSeries(series, legend),
        dataZoom: this.getDataZoom(series)
      }, {
        replaceMerge: ['series'] // 有新series时不合并
      })
    },

    // 根据数据的长度,配置对应的滚动条
    getDataZoom(series) {
      const { barW, gapWP } = this
      const ratio = (this.$refs['chart'].clientWidth * 100 / (series.length * (1 + gapWP) * barW * series[0].data.length)).toFixed(0)

      if (ratio > 100) {
        return []
      } else {
        const dataZoom = this.getChartStyle().dataZoom.concat()
        dataZoom[0].end = Math.max(10, ratio)
        return dataZoom
      }
    },

    // 注册形状
    initChartRegister() {
      // 已注册过
      if (echarts.graphic.getShapeClass('CubeTop')) {
        return
      }

      const w = this.barW
      const h = 12

      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const offsetX = shape.offsetX
          const offsetY = shape.offsetY
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x + offsetX, shape.y + offsetY]
          const c1 = [shape.x - w / 2 + offsetX, shape.y - h / 2 + offsetY]
          const c2 = [xAxisPoint[0] - w / 2 + offsetX, xAxisPoint[1] - h / 2 + offsetY]
          const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] + offsetY]
          ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        }
      })
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const offsetX = shape.offsetX
          const offsetY = shape.offsetY
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x + offsetX, shape.y + offsetY]
          const c2 = [xAxisPoint[0] + offsetX, xAxisPoint[1] + offsetY]
          const c3 = [xAxisPoint[0] + w / 2 + offsetX, xAxisPoint[1] - h / 2 + offsetY]
          const c4 = [shape.x + w / 2 + offsetX, shape.y - h / 2 + offsetY]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
      })
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const offsetX = shape.offsetX
          const offsetY = shape.offsetY
          const c1 = [shape.x + offsetX, shape.y + offsetY]
          const c2 = [shape.x + w / 2 + offsetX, shape.y - h / 2 + offsetY]
          const c3 = [shape.x + offsetX, shape.y - h + offsetY]
          const c4 = [shape.x - w / 2 + offsetX, shape.y - h / 2 + offsetY]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
      })
      echarts.graphic.registerShape('CubeLeft', CubeLeft)
      echarts.graphic.registerShape('CubeRight', CubeRight)
      echarts.graphic.registerShape('CubeTop', CubeTop)
    },

    // 计算指定索引的柱的位置
    getColPosition(len, index) {
      const { barW, gapWP } = this
      // 偏移归0 + 宽度/2 + (宽度+间隙) * index
      return 0.5 * (-barW * len + (1 - len) * gapWP * barW) + 0.5 * barW + index * (1 + gapWP) * barW
    },

    getSeries(series, legend) {
      series = toArray(series)
      legend = toArray(legend)

      const { theme } = this
      const { barW, gapWP } = this

      // 过滤掉隐藏的series
      const legendSelected = legend[0].selected || {}
      series = series.filter(v => {
        return legendSelected[v.name] === undefined ? true : legendSelected[v.name]
      })
      const len = series.length

      const res = []
      series.forEach((item, index) => {
        const color = this.colors[index % this.colors.length]

        const offsetX = this.getColPosition(len, index)

        const cube = {
          type: 'custom',
          name: item.name,
          data: item.data,
          z: 10,
          itemStyle: {
            // 为legend取色
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: hexToRgba(color, 0.9) },
                { offset: 1, color: hexToRgba(color, 0.1) }
              ])
          },
          renderItem: function(params, api) {
            const location = api.coord([api.value(0), api.value(1)])
            return {
              type: 'group',
              children: [{
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                  offsetX,
                  offsetY: 6
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: hexToRgba(color, 0.5)
                  }, {
                    offset: 1,
                    color: hexToRgba(color, 0.1)
                  }
                  ])
                }
              }, {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                  offsetX,
                  offsetY: 6
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: hexToRgba(color, 0.7)
                  }, {
                    offset: 1,
                    color: hexToRgba(color, 0.1)
                  }
                  ])
                }
              }, {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0]),
                  offsetX,
                  offsetY: 6
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: hexToRgba(color, 0.5)
                  }, {
                    offset: 1,
                    color
                  }
                  ])
                }
              }]
            }
          }
        }

        res.push(cube)

        res.push({
          barWidth: barW,
          barGap: gapWP,
          type: 'bar',
          name: item.name,
          z: 99,
          tooltip: {
            show: false
          },
          label: {
            ...theme.series.bar.label,
            padding: [0, 0, 10, 0]
          },
          animationDuration: 0,
          itemStyle: {
            color: 'transparent'
          },
          data: item.data,
          labelLayout: theme.series.bar.labelLayout
        })
      })
      return res
    }

  }
}
</script>

<style lang="scss" type="text/scss">

</style>
