import config from '../../config/index'
import chartStyle from '../skin/light.js'

const AUTOCHARTMKEYLIST = ['ALARM_COUNT', 'REAL_TIME_DEVICE_COUNT']
const TIME5MIN = 10 * 1000 * 60 // 10分钟

export default {
  methods: {
    // 10分钟自动刷新
    autoRefresh(data) {
      if (this.isAutoRefresh && data && data.metricsDes && data.metricsDes.length && this.$route.name === 'statisticalReport') {
        const mKey = data.metricsDes[0].mKey || ''
        if (AUTOCHARTMKEYLIST.indexOf(mKey) > -1) {
          setTimeout(() => {
            if (this.$route.name === 'statisticalReport') {
              console.log('10分钟自动刷新', mKey)
              this.getData()
            }
          }, TIME5MIN)
        }
      }
    },
    // 获取主题图表配置
    getChartStyle() {
      if (['small', 'dialogAdd'].includes(this.mode)) {
        const themeData = config.get('themeData')
        return themeData.chartStyle || chartStyle
      } else {
        // 其他页面使用light主题
        return chartStyle
      }
    }
  }
}
