<script>
/**
 *  超类，为复合类图表提供公共属性和方法
 *  @displayName Super
 */
export default {
  name: 'DashBoardCustomSuper',
  props: {
    /**
     * 当前展示模式
     */
    mode: {
      type: String,
      default: 'normal',
      validator: function(value) {
        return [
          '', // 容错
          'normal', // 默认模式
          'preview', // 预览模式
          'fullScreen', // 单个图表的全屏模式，数据分析-统计报表-全屏
          'edit', // 编辑模式
          'small', // 展示中心和统计报表模式
          'dialogAdd' // 展示中心弹窗添加模式
        ].indexOf(value) !== -1
      }
    },
    /**
     * 组件宽度
     */
    width: {
      type: String,
      default: '100%'
    },
    /**
     * 组件高度
     */
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      dataReady: false,
      dataError: false,
      dataEmpty: false,
      dataLoading: false
    }
  },
  watch: {
    chartData: {
      handler(val) {
        this.render(val)
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    /**
     * 获取图表数据
     * @param conf
     * @returns {Promise<*>}
     */
    async requestData(conf) {
      const res = await this.$Api().PanelItemController.post_previewData.request({
        data: {
          panelItemDTO: conf
        },
        headers: {
          hideNotify: true,
          hideLoading: true
        }
      })
      res.name = new Date().getTime()
      return res
    }

  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.vue-chart{
  min-height: 200px;
}
</style>
