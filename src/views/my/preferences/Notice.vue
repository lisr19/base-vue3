<template>
  <div class="content_right" ref="rightDom">
    <h2>通知方式</h2>
    <el-divider></el-divider>

    <div class="form-container">
      <div class="common-chart-title">通知方式</div>

      <table-page
        :data="tableListData"
        :filter="filter"
        @tableSelectionChange="tableSelectionChange"
        @search="search"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @sortChange="sortChange"
        ref="table"
        id="noticeTable"
        :hideKeyFilter="true"
        :hideSearch="true"
        :hidePagination="true"
        class="noticeTable"
      >
        <template v-slot:column_description="row">
          <div class="description-wrap">
            <el-checkbox
              true-label="SYSTEMPUSH"
              v-model="row.value.checkBox"
              @change="changeCheckbox(row.value)"
              >系统推送</el-checkbox
            >
            <div class="description-radio-wrap">
              <el-radio
                :disabled="!row.value.checkBox"
                v-model="row.value.radio"
                label="POPUP"
                >推送+蓝点提示</el-radio
              >
              <el-radio
                :disabled="!row.value.checkBox"
                v-model="row.value.radio"
                label="BLUE_POINT"
                >仅蓝点提示</el-radio
              >
            </div>
          </div>
          <!-- <div style="background:red;height:80px;width:100%"></div> -->
        </template>
        <template v-slot:column_mpPush="row">
          <!-- {{row.value}} -->
          <el-switch
            v-if="row.value.mpPush != undefined"
            v-model="row.value.mpPush"
            active-color="#13ce66"
          >
          </el-switch>
          <span v-else>-</span>
        </template>
      </table-page>
      <div class="btn-wrapper">
        <el-button type="primary" size="small" @click="handleAllSave"
          >保存设置</el-button
        >
      </div>
      <!-- <div class="common-chart-title">通知方式</div>
      <div class="radio-wrapper">
        <template>
          <el-radio v-model="radio" :label="1">推送+蓝点提示</el-radio>
          <el-radio v-model="radio" :label="2">仅蓝点提示</el-radio>
        </template>
      </div>
      <div class="btn-wrapper">
        <el-button type="primary" size="small" @click="handleSave('alarmNoticeTypes')">保存设置</el-button>
      </div> -->
    </div>
    <div class="tips-container">
      <div class="common-chart-title">通知示例</div>
      <div class="tips-wrapper">
        <div class="tips-item">
          <div class="notice_wrap">
            <div class="notice_box">
              <div class="shape">
                <i class="iconfont el-icon-message-solid"></i>
              </div>
              <div class="content">
                <h3 class="caption">
                  <span>推送</span>
                </h3>
                <p>
                  南沙街道/测试室对讲在2021-06-02
                  09:00:00发生一键呼叫告警，告警值:1，告警级别：紧急告警，告警状态：关闭，告警恢复方式：手动关闭
                </p>
                <p>2021-06-03 09:00:00</p>
              </div>
              <div class="stool">
                <el-button link>上一条</el-button>
                <el-button link>下一条</el-button>
                <el-button link>查看详情</el-button>
              </div>
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
        <div class="tips-item">
          <div class="tips-item-right">
            <p class="tips-title">
              <span class="t1">蓝点提示</span>
              <span class="t2">99+</span>
            </p>
            <p class="tips-sub">以小蓝点的形式显示动态</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-divider></el-divider>
    <h2>工单通知类</h2>
    <div class="form-container">
      <div class="common-chart-title">通知方式</div>
      <div class="radio-wrapper">
        <template>
          <el-checkbox-group v-model="workflowNoticeTypes">
            <el-checkbox label="POPUP">系统弹窗推送</el-checkbox>
            <el-checkbox label="OFFICIAL_ACCOUNTS">公众号推送</el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
      <div class="btn-wrapper">
        <el-button
          type="primary"
          size="small"
          @click="handleSave('workflowNoticeTypes')"
          >保存设置</el-button
        >
      </div>
    </div> -->
  </div>
</template>

<script>
import TablePage from '@/components/TablePage/TablePage'
// import tablePageJs from '@/components/TablePage/TablePage.js'
export default {
  name: 'Notice',
  mixins: [tablePageJs],
  components: {
    TablePage
  },
  data () {
    return {
      radio: '',
      workflowNoticeTypes: [],
      mapping: {
        1: ['BLUE_POINT', 'PUSH'],
        2: ['BLUE_POINT']
      },
      tableData: []
    }
  },
  computed: {
    tableListData () {
      let tableListData = {
        selection: false,
        columnFunctionsWidth: '150px',
        tableData: this.tableData,
        tableKeys: [
          {
            id: 'noticeType',
            label: '通知类型',
            minWidth: '130',
            slotFormat: true
          },
          {
            id: 'description',
            label: '系统推送',
            minWidth: '290',
            slotFormat: true
          },
          {
            id: 'mpPush',
            label: '公众号推送',
            minWidth: '100',
            slotFormat: true
          }
        ],
        tableFunctions: []
      }

      return tableListData
    }
  },

  mounted () {
    this.tableData = [
      {
        noticeType: '告警通知类',
        noticeTypeId: 'alarmNoticeTypes',

        checkBox: '',
        radio: ''
      },
      {
        noticeType: '工单通知类',
        mpPush: false,
        noticeTypeId: 'workflowNoticeTypes',
        checkBox: '',
        radio: ''
      },
      {
        noticeType: '屏幕下发类',
        noticeTypeId: 'ledNoticeTypes',
        checkBox: '',
        radio: ''
      },
      {
        noticeType: '广播下发类',
        noticeTypeId: 'radioNoticeTypes',
        checkBox: '',
        radio: ''
      }
    ]
    this.filter.pageSize = 10
    this.filter.pageNum = 1
    this.filter.rowTotal = 4

    this.getData()
  },

  methods: {
    changeCheckbox (data) {
      console.log(data)
      if (!data.checkBox) {
        data.checkBox = ''
      }
      if (data.checkBox) {
        data.radio = 'POPUP'
      } else {
        data.radio = ''
      }
    },
    // 获取个人配置
    async getData () {
      let res = await this.$Api().PersonalPreferenceNoticeController.get_notice.request()

      this.tableData.map(item => {
        let arr = res[item.noticeTypeId]
        if (!arr) {
          arr = []
        }
        if (arr.includes('SYSTEMPUSH')) {
          item.checkBox = 'SYSTEMPUSH'
        }
        if (arr.includes('BLUE_POINT')) {
          item.radio = 'BLUE_POINT'
        }
        if (arr.includes('POPUP')) {
          item.radio = 'POPUP'
        }
        if (item.mpPush != undefined) {
          if (arr.includes('OFFICIAL_ACCOUNTS')) {
            item.mpPush = true
          }
        }
        console.log(250, item)
      })

      let alarmNoticeTypes = res.alarmNoticeTypes

      this.workflowNoticeTypes = res.workflowNoticeTypes || []
      this.$store.commit('user/SET_NOTICETYPE', alarmNoticeTypes)
      this.$store.commit(
        'user/SET_WORKFLOWNOTICETYPES',
        this.workflowNoticeTypes
      )
      console.log('获取个人配置', res)
      if (alarmNoticeTypes && alarmNoticeTypes.length) {
        if (
          alarmNoticeTypes.indexOf('BLUE_POINT') > -1 &&
          alarmNoticeTypes.indexOf('PUSH') > -1
        ) {
          this.radio = 1
        } else if (alarmNoticeTypes.indexOf('BLUE_POINT') > -1) {
          this.radio = 2
        }
      }
    },
    handleAllSave () {
      let param = {}

      //       mpPush: false,
      // noticeTypeId: 'workflowNoticeTypes',
      // checkBox: '',
      // radio: ''

      this.tableData.map(item => {
        let arr = []
        if (item.mpPush != undefined) {
          if (item.mpPush) {
            arr.push('OFFICIAL_ACCOUNTS')
          }
        }
        if (item.checkBox != '') {
          arr.push(item.checkBox)
        }

        if (item.radio != '') {
          arr.push(item.radio)
        }

        param[item.noticeTypeId] = arr
      })

      this.$Api()
        .PersonalPreferenceNoticeController.post_notice.request({
          data: param
        })
        .then(res => {
          this.getData()
        })
    },
    handleSave (type) {
      if (type === 'alarmNoticeTypes' && !this.radio) {
        this.$message.warning('请选择通知方式')
        return
      }
      let param = {}
      if (type === 'alarmNoticeTypes') {
        param = {
          alarmNoticeTypes: this.mapping[this.radio]
        }
      } else {
        param = {
          workflowNoticeTypes: this.workflowNoticeTypes
        }
      }
      this.$Api()
        .PersonalPreferenceNoticeController.post_notice.request({
          data: param
        })
        .then(res => {
          this.getData()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.noticeTable /deep/ {
  .content {
    padding: 0 !important;
  }
}

.description-wrap {
  display: flex;
  align-items: center;
  padding: 10px 0;
  .description-radio-wrap {
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    .el-radio {
      margin-top: 10px;
    }
  }
}

.content_right {
  flex: 1;
  margin-left: 24px;
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  h2 {
    padding: 20px 20px 0;
    font-size: 16px;
    // font-weight: bold;
    color: #0c1014;
    // border-bottom: 1px solid #e8e8e8;
  }
}
.radio-wrapper {
  margin-top: 25px;
  margin-right: 50px;
}
.btn-wrapper {
  margin-top: 25px;
}
.form-container {
  padding: 0px 20px 50px;
}
.tips-container {
  padding: 0 20px 20px;
}
.tips-wrapper {
  display: flex;
  align-items: flex-start;
  margin-top: 30px;
}
.tips-item {
  display: flex;
  align-items: center;
  margin-right: 100px;
  position: relative;
  .tips-item-left {
    img {
      width: 48px;
    }
  }
  .tips-item-right {
    margin-left: 20px;
  }
  .tips-title {
    color: #0c1014;
    font-size: 14px;
    .t2 {
      color: #fff;
      font-size: 14px;
      padding: 2px 4px;
      background-color: #345ef0;
      border-radius: 10px;
      margin-left: 8px;
    }
  }
  .tips-sub {
    margin-top: 4px;
    color: #4b5869;
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
.notice_wrap {
  position: relative;
  width: 400px;
  z-index: 11;
}
.notice_box {
  position: relative;
  padding: 14px;
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
  font-size: 12px;
}
.notice_box .shape {
  position: absolute;
  top: 50%;
  left: 14px;
  margin-top: -30px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  background-color: #ff4a49;
  border-radius: 50%;
  color: #fff;
  text-align: center;
}
.notice_box .shape .iconfont {
  font-size: 40px;
  line-height: 60px;
}
.notice_box .content {
  margin: 0px;
  margin-left: 76px;
  padding: 0 20px 0 0;
  white-space: normal;
}
.notice_box .content .caption {
  padding: 0.4em 0 0.8em;
  color: #3e3b3f;
  font-weight: 600;
}
.notice_box .content p {
  margin: 0;
  color: #8895a8;
  line-height: 1.5em;
}
.notice_box .stool {
  position: relative;
  bottom: inherit;
  left: inherit;
  padding: 0 0;
  text-align: right;
}
.notice_box .stool .el-button {
  padding: 8px 0;
  font-size: 12px;
  cursor: auto;
}
.notice_box .el-icon-close {
  position: absolute;
  top: 6px;
  right: 10px;
  border: 4px solid #fff;
  font-size: 16px;
}
</style>
