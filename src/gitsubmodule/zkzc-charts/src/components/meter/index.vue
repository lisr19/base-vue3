<script>
import echarts from '../../plugins/echarts'
import Super from '../super/index.vue'

export default {
  name: 'MeterIndex',
  components: {},
  extends: Super,
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    radius: {
      // 半径尺寸
      type: Number,
      default: 90
    },
    center: {
      // 圆心位置
      type: Array,
      default: () => {
        return ['50%', '65%']
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

    render(data) {
      if (!data || !data.option) {
        return
      }
      const { series } = data.option

      const { theme } = this

      this.chart.setOption({
        textStyle: theme.textStyle,
        grid: theme.grid,
        series: this.getSeries(series)
      })
    },

    getSeries(series) {
      const value = series[0].data[0]
      const title = series[0].name

      const { radius, center, theme } = this

      const num = value / 100
      const color1 = new echarts.graphic.LinearGradient(0, 0, 1, 0,
        [{ offset: 0, color: '#40B9FE' },
          { offset: 1, color: '#2B4FC6' }
        ])
      const color2 = '#FF445E'
      const colorSet = [
        [num, color1],
        [1, color2]
      ]
      return [
        {
          name: '白色圈刻度',
          type: 'gauge',
          radius: radius + 35 + '%',
          splitNumber: 5,
          center: center,
          startAngle: 180, // 刻度起始
          endAngle: 0, // 刻度结束
          z: 4,
          axisTick: {
            show: false
          },
          splitLine: {
            length: 8, // 刻度节点线长度
            lineStyle: {
              width: 1,
              color: '#2B4FC6',
              opacity: 0.5
              //   color: 'rgba(14,15,20, 0.8)'
            } // 刻度节点线
          },
          axisLabel: {
            show: false,
            color: '#',
            fontSize: 12
          }, // 刻度节点文字颜色
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              opacity: 0
            }
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 0,
              name: ''
            }
          ]
        },
        // 外圈刻度文字
        {
          name: '外圈刻度m', // 刻度背景
          type: 'gauge',
          z: 2,
          radius: radius + 70 + '%',
          splitNumber: 5,
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          center: center, // 整体的位置设置
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [0.8, '#00B3FE'],
                [1, '#212D43']
              ],
              width: 35,
              opacity: 0 // 刻度背景宽度
            }
          },
          splitLine: {
            show: false
          },
          data: [
            {
              show: false,
              value: '80'
            }
          ],
          axisLabel: {
            show: true,
            //   distance: 10,
            textStyle: {
              color: theme.meter.index.axisLabelColor,
              fontSize: '14'
            }
          },
          pointer: {
            show: false
          },
          axisTick: {
            show: false
          },
          detail: {
            show: 0
          }
        },
        {
          name: '蓝圈背景', // 刻度背景
          type: 'gauge',
          z: 10,
          radius: radius + 10 + '%',
          splitNumber: 6,
          startAngle: 180,
          endAngle: 0,
          //   min: 0,
          //   max: 15,
          center: center, // 整体的位置设置
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: colorSet,
              width: 18,
              opacity: 1, // 刻度背景宽度
              shadowColor: 'rgba(64, 185, 254, 0.5)', // 默认透明
              shadowBlur: 20
            }
          },
          splitLine: {
            show: false
          },
          data: [
            {
              show: false,
              value
            }
          ],
          axisLabel: {
            show: false
          },
          pointer: {
            show: true,
            length: '75%',
            offsetCenter: [0, 10],
            width: 15, // 指针粗细
            icon: 'path://M28.4235141,55.194005 C32.013365,55.194005 34.9235141,52.2838559 34.9235141,48.694005 C34.9235141,46.3007711 32.6780097,27.8063707 28.1870008,-6.78919614 C24.011343,27.8063707 21.9235141,46.3007711 21.9235141,48.694005 C21.9235141,52.2838559 24.8336632,55.194005 28.4235141,55.194005 Z'
          },
          anchor: {
            show: true,
            icon: 'circle',
            size: 8,
            showAbove: true,
            itemStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          detail: {
            show: 0
          }
        },
        {
          name: '刻度尺', // 刻度背景
          type: 'gauge',
          z: 2,
          radius: radius + 20 + '%',
          splitNumber: 6,
          startAngle: 180,
          endAngle: 0,
          // min: 0,
          // max: 15,
          center: center, // 整体的位置设置
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [0.8, '#00B3FE'],
                [1, '#212D43']
              ],
              width: 35,
              opacity: 0 // 刻度背景宽度
            }
          },
          data: [
            {
              show: false,
              value: '80'
            }
          ],
          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },
          axisTick: {
            show: false
          },
          detail: {
            formatter() {
              return title
            },
            color: theme.textStyle.color,
            fontSize: 14,
            fontWeight: 'normal',
            offset: ['0', '-250%']
          },
          splitLine: {
            show: false
          }
        },
        {
          name: '蓝色刻度尺', // 刻度背景
          type: 'gauge',
          z: 4,
          radius: radius + 20 + '%',
          splitNumber: 5,
          startAngle: 180,
          endAngle: 0, // degrees
          // min: 0,
          // max: 15,
          center: center, // 整体的位置设置
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: '#203C94',
              width: 30,
              opacity: 0 // 刻度背景宽度
            }
          },
          data: [{ value: 10 }],
          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#00B3FE',
              width: 1
            },
            length: 6,
            splitNumber: 6
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#00B3FE',
              width: 3
            },
            length: 6,
            splitNumber: 6
          },
          detail: {
            show: false
          }
        },
        // 背景部分
        // 外侧灰色轴线
        {
          type: 'gauge',
          radius: '40%', // 位置
          center: center,
          z: -1,
          min: 0,
          max: 100,
          startAngle: 180,
          endAngle: 0,
          axisLine: {
            show: true,
            lineStyle: {
              // 轴线样式
              width: 2, // 宽度
              color: [
                [1, '#2B4FC6']
              ] // 颜色
            }
          },
          axisTick: {
            // 刻度
            show: false
          },
          splitLine: {
            // 分割线
            show: false
          },
          axisLabel: {
            // 刻度标签
            show: false
          },
          pointer: {
            // 仪表盘指针
            show: false
          },
          detail: {
            // 仪表盘详情
            show: false
          }
        },
        // 第五层：背景圆
        {
          type: 'pie',
          radius: ['0', '13%'],
          hoverAnimation: false,
          center: center,
          cursor: 'auto',
          itemStyle: {
            color: '#2B4FC6',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          },
          data: [{
            value: 100
          }],
          labelLine: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: '#146a90'
            }
          },
          z: -2
        },
        {
          type: 'pie',
          radius: ['0', '20%'],
          hoverAnimation: false,
          center: center,
          cursor: 'auto',
          itemStyle: {
            color: '#2B4FC6',
            opacity: 0.3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          },
          data: [{
            value: 100
          }],
          labelLine: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: '#146a90'
            }
          },
          z: -3
        }
      ]
    }

  }
}
</script>

<style lang="scss" type="text/scss">

</style>
