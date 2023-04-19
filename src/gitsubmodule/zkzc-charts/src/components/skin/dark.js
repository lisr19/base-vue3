import echarts from '../../plugins/echarts'
import { hexToRgba } from '../../utils/tools'

const colors = [
  '#40B9FE',
  '#00E9EA',
  '#25D73B',
  '#f6d94a',
  '#FF445E',
  '#6B35D6',
  '#4155d4',
  '#97d73c',
  '#38c458',
  '#fda43f',
  '#f36528'
]

const icons = {
  ring: `path://M881.387 297.813c38.08 65.387 57.28 136.747 57.28 214.187s-19.094 148.8-57.28 214.187c-38.187 65.28-89.92 117.12-155.2 155.2S589.44 938.667 512 938.667s-148.8-19.094-214.187-57.28c-65.28-38.08-117.013-89.814-155.306-155.307C104.427 660.8 85.333 589.44 85.333 512c0-77.333 19.094-148.693 57.28-214.187 38.08-65.28 89.814-117.013 155.307-155.306C363.2 104.533 434.56 85.333 512 85.333c77.333 0 148.693 19.094 214.187 57.28 65.28 38.187 117.013 89.92 155.2 155.2z m-217.707-47.36C617.387 223.467 566.827 209.92 512 209.92s-105.387 13.547-151.68 40.533-82.987 63.68-109.973 109.974c-26.987 46.293-40.534 96.853-40.534 151.68s13.547 105.386 40.534 151.68c26.986 46.293 63.68 82.986 109.973 109.973 46.293 26.987 96.853 40.533 151.68 40.533s105.387-13.546 151.68-40.533c46.293-26.987 82.987-63.68 109.973-109.973 26.987-46.294 40.534-96.854 40.534-151.68s-13.547-105.387-40.534-151.68c-27.093-46.294-63.786-82.987-109.973-109.974z`
}

// 获取随机颜色数组
function getColors(conf = {random: true}) {
  const arr = [...colors]
  if (conf.random) {
    arr.sort(function () {
      return 0.5 - Math.random()
    })
  }
  return arr
}

// 根据主题风格 增强颜色
function enhanceColor (color) {
  let res = new echarts.graphic.LinearGradient(
    0, 0, 0, 1,
    [
      { offset: 0, color: hexToRgba(color, 0.9) },
      { offset: 0.3, color: hexToRgba(color, 0.5) },
      { offset: 1, color: hexToRgba(color, 0.1) }
    ]
  )
  return res
}

const labelLayout = {
  hideOverlap: true,
  moveOverlap: true
}

const dataZoom = [
  {
    type: 'slider',
    show: false,
    start: 0,
    end: 30,
    z: 999,
    height: 10,
    xAxisIndex: [0]
  },
  {
    type: 'inside',
    start: 0,
    end: 30,
    xAxisIndex: [0]
  }
]

export default {
  id: 'dark',
  icons,
  getColors,
  enhanceColor,
  dataZoom,
  textStyle: {
    fontFamily: 'MADE_TOMMY_Regular, SOURCE_HAN_Regular',
    color: '#fff'
  },
  // 计时器配置
  counter: {
    // 翻页时间
    pageInterval: 10000,
    // countT数字加载时间
    countToDuration: 3000
  },
  // 饼图配置数据
  pie: {
    // title切换定时
    titleInterval: 3000,
    // 外圈颜色
    routeRingColor: '#46536f',
    // 饼图圆心
    pieCenter: ['30%', '50%'],
    // 几何体透明度
    pieOpacity: 1,
    // 几何体默认高度
    pieHeight: 5
  },
  // 条纹图自动翻页的间隔
  stripe: {
    pageInterval: 10000
  },
  meter: {
    index: {
      axisLabelColor: '#fff'
    },
    ring: {
      hasBlur: true
    }
  },
  // 公共配置
  title: {
    fontFamily: 'MADE_TOMMY_Regular, SOURCE_HAN_Regular',
    color: '#fff'
  },
  grid: {
    left: '10em',
    bottom: '5em',
    top: '50em',
    right: '15em',
    containLabel: true
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'transparent',
    borderRadius: '0',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    top: '5px',
    right: '10px',
    padding: [0, 5],
    width: '50%',
    textStyle: { color: '#999EB1' },
    pageTextStyle: { color: '#999EB1' },
    type: 'scroll',
    pageIconColor: '#aaa',
    pageIconInactiveColor: '#2f4554'
  },
  xAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#0C5F9A'
      }
    },
    axisLabel: {
      color: '#999EB1'
    },
    splitLine: {
      show: false
    },
    boundaryGap: ['20%', '20%']
  },
  yAxis: {
    nameTextStyle: {
      color: '#999EB1'
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#4d606c',
        width: 0.5,
        type: 'dashed'
      }
    },
    axisLabel: {
      color: '#999EB1',
      fontSize: 14,
      fontWeight: 'bold'
    },
    // max: function (value) {
    //   return Math.ceil(value.max * 1.2)
    // }
  },
  series: {
    bar: {
      // barWidth: '50%',
      // barGap: '5%',
      label: {
        show: true,
        position: 'top',
        borderWidth: 0,
        color: '#fff',
        formatter: function ({ value }) {
          return parseFloat(value) === 0 ? '' : value
        }
      },
      animationDuration: 1000,
      labelLayout
    },
    pie: {
      label: {
        show: true,
        position: 'top',
        borderWidth: 0,
        color: '#fff'
      },
      labelLayout
    },
    line: {
      // smooth: true,
      label: {
        show: true,
        position: 'top',
        borderWidth: 0,
        color: '#fff'
      },
      symbolSize: 8,
      lineStyle: {
        width: 3,
        shadowColor: `rgba(0,0,0,0.2)`
      },
      itemStyle: {
        normal: {
          shadowBlur: 2,
          shadowColor: 'rgba(0,0,0, 0.05)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      },
      labelLayout
    }
  }
}
