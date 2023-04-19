<script>
import 'echarts-gl'
import { toArray } from '../../utils/tools'
import Super from '../super/index.vue'

/**
 * 饼图 - 3D模式
 */
export default {
  name: 'PieSolid',
  components: {},
  extends: Super,
  props: {
    /**
     * 俯视角角度
      */
    pitch: {
      type: Number,
      default: 30
    },
    /**
     * 水平或垂直布局
     */
    layout: {
      type: String,
      default: 'row',
      validator: function(value) {
        return ['row', 'col'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      // 切换定时器
      titleClock: null,
      // 缓存属性数据
      pieData: {
        count: 0, // 几何块数量
        total: 0 // 所有值之和
      },
      // 当前高亮块的索引值
      hoveredIndex: '',
      colors: [],
      layoutConf: Object.freeze({
        row: {
          title: {
            left: '35%',
            top: '38%'
          },
          legend: {
            orient: 'vertical',
            right: '5%',
            top: 'middle',
            bottom: '10%'
          },
          grid3D: {
            top: '-10%',
            left: '-15%'
          }
        },
        col: {
          title: {
            left: '50%',
            top: '10%'
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            right: 'auto',
            top: 'auto',
            bottom: '10%',
            width: '90%'
          },
          grid3D: {
            top: '-25%',
            left: '0%'
          }
        }
      })
    }
  },
  created() {
    this.colors = Object.freeze(this.theme.getColors({ random: false }))
  },
  async mounted () {
    await this.init()
    // 定时切换
    this.initClock()
    // 鼠标交互
    this.initInteract()
  },
  beforeDestroy() {
    this.destroyClock()
    this.removeInteract()
  },
  methods: {

    render(data) {
      // 初始化当前高亮块的索引值
      this.hoveredIndex = ''
      if (!data || !data.option) {
        return
      }
      const { series, legend } = data.option

      const option = this.getSeries(series, legend)

      this.chart.setOption(option, { replaceMerge: ['series'] }) // 有新series时不合并

      // 高亮第1个块
      this.updateHoverdIndex(0)
    },

    getSeries(series, legend) {
      legend = toArray(legend)
      series = toArray(series)

      // 为保证性能 最多允许20个几何块
      let sdata = series[0].data.filter(item => parseFloat(item.value) > 0).slice(0, 20)

      // 过滤掉隐藏的series
      const legendSelected = legend[0].selected || {}
      sdata = sdata.filter(v => {
        return legendSelected[v.name] === undefined ? true : legendSelected[v.name]
      })

      sdata.sort((a, b) => {
        return b.value - a.value
      })

      const { theme } = this
      const pieData = sdata.map((item, index) => {
        return {
          name: item.name,
          value: parseFloat(item.value),
          itemStyle: {
            color: this.colors[index % this.colors.length],
            opacity: theme.pie.pieOpacity
          }
        }
      })

      // 求总和
      this.pieData.total = sdata.reduce((a, b) => {
        return parseFloat(a) + (b.value ? parseFloat(b.value) : 0)
      }, 0)
      // 块数
      this.pieData.count = sdata.length

      const option = this.getPie3D(pieData, 0.7)

      return option
    },

    // 鼠标交互事件
    initInteract() {
      if (!this.chart) {
        return
      }

      this.chart.on('mouseover', (params) => {
        this.updateHoverdIndex(params.seriesIndex)
      })

      const t = this

      this.chart.off('legendselectchanged')
      this.chart.on('legendselectchanged', (params) => {
        const { series } = t.chartData.option
        const { legend } = t.chart.getOption()
        const { selected = {}} = params
        const newSeries = t.getSeries(series, legend)
        newSeries.legend = legend
        // 更新series
        t.chart.setOption(newSeries)

        const option = this.chart.getOption()

        let isAllCancel = true
        Object.values(selected).forEach((item) => {
          if (item) {
            isAllCancel = false
            return false
          }
        })
        // 若取消选择所有图例，中间文字不显示
        if (isAllCancel) {
          option.title[0].text = ''
          option.title[0].subtext = ''
          t.chart.setOption(option, true)
          return
        }

        // 默认选择数值最大的区块高亮
        let targetIndex = 0
        let maxVal = 0
        option.series.forEach((item, index) => {
          if (selected[item.name] !== false && item.pieData.value > maxVal) {
            maxVal = item.pieData.value
            targetIndex = index
          }
        })
        this.updateHoverdIndex(targetIndex)
      })
    },

    removeInteract() {
      if (this.chart) {
        this.chart.off('mouseover')
        this.chart.off('legendselectchanged')
        this.chart = null
      }
    },

    // 根据索引值更新高亮块
    updateHoverdIndex(val) {
      const sum = this.pieData.total
      const option = this.chart.getOption()
      const { theme } = this

      // 如果触发 mouseover 的扇形当前已高亮，则不做操作
      //   if (this.hoveredIndex === val) {
      //     return
      //   }
      if (option.series.length === 0) {
        return
      }

      // 如果当前有高亮的扇形，取消其高亮状态
      if (this.hoveredIndex !== '') {
        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
        option.series[this.hoveredIndex].parametricEquation = this.getParametricEquation({
          isSelected: option.series[this.hoveredIndex].pieStatus.selected,
          startRatio: option.series[this.hoveredIndex].pieData.startRatio,
          endRatio: option.series[this.hoveredIndex].pieData.endRatio,
          k: option.series[this.hoveredIndex].pieStatus.k,
          h: theme.pie.pieHeight
        })
        option.series[this.hoveredIndex].pieStatus.hovered = false

        // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
        this.hoveredIndex = ''
      }

      // 将当前触发的几何块高亮
      option.series[val].parametricEquation = this.getParametricEquation({
        isSelected: option.series[val].pieStatus.selected,
        startRatio: option.series[val].pieData.startRatio,
        endRatio: option.series[val].pieData.endRatio,
        k: option.series[val].pieStatus.k,
        h: Math.ceil(theme.pie.pieHeight * 3)
      })
      option.series[val].pieStatus.hovered = true

      // 更新文字
      option.title[0].text = (option.series[val].pieData.value / sum * 100).toFixed(2) + '%'
      option.title[0].subtext = option.series[val].name

      // 记录上次高亮的扇形对应的系列号 seriesIndex
      this.hoveredIndex = val

      // 使用更新后的 option，渲染图表
      this.chart.setOption(option)
    },

    // 生成模拟 3D 饼图的配置项
    // internalDiameterRatio 内外环半径比
    getPie3D(pieData, internalDiameterRatio) {
      const { theme } = this
      const series = []
      let sumValue = 0
      let startValue = 0
      let endValue = 0
      const legendData = []
      const k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3

      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value

        const seriesItem = {
          name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
          type: 'surface',
          parametric: true,
          wireframe: {
            show: false
          },
          itemStyle: {
            opacity: theme.pie.pieOpacity
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k
          }
        }

        if (typeof pieData[i].itemStyle !== 'undefined') {
          const itemStyle = {}
          itemStyle.color = typeof pieData[i].itemStyle.color !== 'undefined' ? pieData[i].itemStyle.color : null
          pieData[i].itemStyle.opacity = theme.pie.pieOpacity
          seriesItem.itemStyle = itemStyle
          seriesItem.itemStyle.opacity = theme.pie.pieOpacity
        }
        series.push(seriesItem)
      }

      // 使用上一次遍历时，计算出的数据和 sumValue
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value

        series[i].pieData.startRatio = startValue / sumValue
        series[i].pieData.endRatio = endValue / sumValue
        // 三维饼图的Z轴高度，这里设置为固定高度，也可以设置为比例高度(series[i].pieData.value)
        series[i].parametricEquation = this.getParametricEquation({
          startRatio: series[i].pieData.startRatio,
          endRatio: series[i].pieData.endRatio,
          isSelected: false,
          k,
          h: theme.pie.pieHeight
        })

        startValue = endValue

        legendData.push(series[i].name)
      }

      const chartOption = this.chart.getOption()

      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      const option = {
        backgroundColor: 'transparent',
        textStyle: theme.textStyle,
        title: {
          ...this.layoutConf[this.layout].title,
          itemGap: 1, // 标题副标题间距
          textAlign: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 30,
            textShadowColor: '#111629',
            textShadowBlur: 7
          },
          subtextStyle: {
            fontWeight: 'bold',
            fontSize: 14,
            color: '#fff',
            align: 'center',
            textShadowColor: '#111629',
            textShadowBlur: 7
          }
        },
        legend: {
          ...theme.legend,
          ...this.layoutConf[this.layout].legend,
          show: true,
          padding: [10, 0],
          itemGap: 10,
          type: 'scroll',
          icon: theme.icons.ring,
          data: legendData
        },
        tooltip: {
          ...theme.tooltip,
          formatter: params => {
            if (params.seriesName !== 'mouseoutSeries') {
              return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${chartOption.series[params.seriesIndex].pieData.value}`
            }
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          ...this.layoutConf[this.layout].grid3D,
          show: false,
          boxHeight: 20,
          viewControl: { // 3d效果可以放大、旋转等，请自己去查看官方配置
            alpha: this.pitch, // 视角绕 x 轴 旋转角度
            rotateSensitivity: 0,
            zoomSensitivity: 0,
            panSensitivity: 0,
            autoRotate: false,
            beta: -90 // 起始角度
          }
        },
        series
      }
      return option
    },

    /**
     * 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
     * 参考 ： https://madeapie.com/#/chartInfo/xX9xcKXRjq
     * @param startRatio {Number} 开始角度
     * @param endRatio {Number} 结束角度
     * @param isSelected {Boolean} 是否置为选中状态
     * @param k  {Number} 扇形内径/外径的值,默认1/3
     * @param h {Number} 几何体高度
     * @returns {}
     */
    getParametricEquation({
      startRatio,
      endRatio,
      isSelected,
      k = 0.333,
      h
    }) {
      // 计算
      const midRatio = (startRatio + endRatio) / 2

      const startRadian = startRatio * Math.PI * 2
      const endRadian = endRatio * Math.PI * 2
      const midRadian = midRatio * Math.PI * 2

      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        isSelected = false
      }

      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
      const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      const hoverRate = 1.1
      // 扇形变圆形后有时有边长过长的问题，所以加入边长比例参数belta便于调节
      const belta = 1.3

      // 返回曲面参数方程
      return {

        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 30
        },

        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 30
        },

        x: function(u, v) {
          if (u < startRadian) {
            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate * belta
          }
          if (u > endRadian) {
            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate * belta
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate * belta
        },

        y: function(u, v) {
          if (u < startRadian) {
            return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate * belta
          }
          if (u > endRadian) {
            return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate * belta
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate * belta
        },

        z: function(u, v) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u)
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u) * h * 0.1
          }
          return Math.sin(v) > 0 ? 1 * h * 0.1 : -1
        }
      }
    },

    initClock() {
      if (!this.clockEnable) {
        return
      }
      const { theme } = this
      this.titleClock = setInterval(() => {
        try {
          // 高亮下一个几何块
          const targetIndex = (this.hoveredIndex + 1) % this.pieData.count
          this.updateHoverdIndex(targetIndex)
        } catch (error) {
          console.error(`pie/solid 定时渲染文字失败 ${error.cause}`)
          this.destroyClock()
        }
      }, theme.pie.titleInterval)
    },

    destroyClock() {
      if (this.titleClock) {
        clearInterval(this.titleClock)
        this.titleClock = null
      }
    }

  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.pie-solid{
  .vue-chart{
    position: relative;
  }
}
</style>
