<template>
  <div class="content_right">
    <table-page
        :data="tableListData"
        :filter="filter"
        @search="goSearch"
        @resetSearch="resetSearch"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @tableSelectionChange="tableSelectionChange"
        @setTableKeys="setTableKeys"
        @selectAll="tableSelectAllStatus"
        ref="table"
        id="preferencesWarning"
    >
      <template slot="searchFilter">
        <el-form :inline="true" :model="filter" :label-width="labelWidth">
          <el-form-item label="告警大类" >
            <el-select v-model="filter.condition.eventType" @change="changeEventType" size="small" placeholder="请选择告警大类" >
              <el-option label="全部" value="" ></el-option>
              <el-option v-for="item in eventTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警类型" >
            <el-select v-model="filter.condition.eventDetail" filterable size="small" placeholder="请选择告警类型" >
              <el-option  label="全部" value="" ></el-option>
              <el-option v-for="item in eventDetailList" :key="item.id" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订阅状态" >
            <el-select v-model="filter.condition.isSubscribe" size="small" placeholder="请选择状态"  >
              <el-option  label="全部" value="" ></el-option>
              <el-option  label="已订阅" :value="true" ></el-option>
              <el-option  label="未订阅" :value="false" ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:column_isSubscribe="row">
        <el-switch v-model="row.value.isSubscribe" active-color="#13ce66" inactive-color="#ff4949" @change="(e) => {change(row.value,e)}"></el-switch>
      </template>
      <template v-slot:column_deviceType="row">
        {{deviceTypeListMapping[row.value.deviceType] ? deviceTypeListMapping[row.value.deviceType].name : ''}}
      </template>
      <template v-slot:column_subscribeMethods="row">
        <el-checkbox v-model="item.isSubscribe" @change="(e) => {changeMethods(row.value,e)}" v-for="item in row.value.notificationMode" :key="item.notificationMode" :label="item.notificationMode" :disabled="!row.value.isSubscribe">{{item.notificationModeCN || item.notificationMode}}</el-checkbox>
      </template>
      <!-- 控制栏 -->
<!--      <template slot="controller">-->
<!--        <el-button type="primary" icon="el-icon-upload2" :disabled="disabledExport" size="small" @click="exportFn()">导出</el-button>-->
<!--      </template>-->
    </table-page>
  </div>
</template>

<script>
// import tablePageJs from '@/components/TablePage/TablePage.js'
// import TablePage from '@/components/TablePage/TablePage.vue'
export default {
  name: 'warning',
  components: {
    TablePage
  },
  mixins: [tablePageJs],
  data () {
    return {
      tableData: [],
      filter: {
        condition: {
          eventType: '', // 告警大类
          eventDetail: '', // 告警类型
          isSubscribe: ''
        },
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: null // 总条数
      },
      current: {}, // 当前操作的行
      labelWidth: '120px',
      eventTypeList: [],
      tableKeys: [
        {
          id: 'eventTypeCn',
          label: '告警大类',
          align: 'center'
        },
        {
          id: 'eventDetailCn',
          label: '告警名称',
          minWidth: '100px',
          align: 'center'
        },
        {
          id: 'deviceType',
          label: '设备类型',
          minWidth: '100px',
          align: 'center'
        },
        {
          id: 'isSubscribe',
          label: '订阅',
          align: 'center'
        },
        {
          id: 'subscribeMethods',
          label: '通知方式',
          minWidth: '140px',
          align: 'center'
        }
      ],
      notifyType: []
    }
  },
  async mounted () {
    let alarmTypesList = Object.values(this.$SDK.dict.alarmTypesList)
    // console.log('字典', this.$SDK.dict)
    this.eventTypeList = alarmTypesList.filter(item => item.parentId === 'root')

    let notifyType = await this.$Api().AlarmTypeController.get_serviceTypeAuth.request()
    this.notifyType = notifyType.filter(v => v.enable).map(v => v.uKey)
    this.getData()
  },
  computed: {
    tableListData () {
      let tableData = {
        selection: false,
        columnFunctionsWidth: 180, // 操作栏宽度
        tableData: this.tableData,
        tableKeys: this.tableKeys
      }
      return tableData
    },
    deviceTypeListMapping () {
      return this.$SDK.dict.deviceTypeListNA || this.$SDK.dict.deviceTypeList
    },
    eventDetailList () {
      let alarmTypesList = Object.values(this.$SDK.dict.alarmTypesList)
      let list = alarmTypesList.filter(item => item.parentId !== 'root')
      let obj = {}
      list = list.reduce((arr, item) => {
        obj[item.key] ? '' : obj[item.key] = true && (!this.filter.condition.eventType || item.parentId === this.filter.condition.eventType) && arr.push(item)
        return arr
      }, [])
      // console.log('告警类型', list)
      return list
    }
  },
  methods: {
    goSearch () {
      this.filter.pageNum = 1
      this.getData()
    },
    getData () {
      let condition = {}
      for (var key in this.filter.condition) {
        let value = this.filter.condition[key]
        if (value !== '') {
          condition[key] = value
        }
      }
      let filterFormat = {
        condition: condition,
        pageSize: this.filter.pageSize,
        pageNum: this.filter.pageNum
      }
      this.$Api().PersonalPreferenceAlarmSubscribeController.post_findPage.request({
        data: filterFormat,
        headers: {
          hideNotify: true
        }
      }).then(res => {
        res.data.forEach(v => {
          v.notificationMode = v.notificationMode.filter(item => this.notifyType.includes(item.notificationMode))
        })
        this.tableData = res.data
        this.filter.rowTotal = res.total
      })
    },
    change (row, newValue) {
      // if (newValue) {
      //   row.notificationMode = ['email','sms']
      // } else {
      //   row.notificationMode = []
      // }
      this.updateSubscribe({
        alarmTypeId: row.alarmTypeId,
        isSubscribe: newValue,
        notificationMode: row.notificationMode && row.notificationMode.length ? row.notificationMode.filter(item => item.isSubscribe).map(item => item.notificationMode) : []
      })
    },
    changeMethods (row) {
      this.updateSubscribe({
        alarmTypeId: row.alarmTypeId,
        isSubscribe: row.isSubscribe,
        notificationMode: row.notificationMode && row.notificationMode.length ? row.notificationMode.filter(item => item.isSubscribe).map(item => item.notificationMode) : []
      })
    },
    getCurrent (row) {
      this.current = row
    },
    // 更新订阅
    updateSubscribe (data) {
      console.log('data', data)
      this.$Api().PersonalPreferenceAlarmSubscribeController.post_subscribe.request({
        data
      }).then(res => {
      })
    },
    changeEventType () {
      this.filter.condition.eventDetail = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.content_right {
  flex: 1;
  margin-left: 24px;
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  //padding: 20px 30px;
  box-sizing: border-box;
  h2 {
    font-size: 18px;
    font-weight: bold;
    color: #0c1014;
  }
}
.radio-wrapper {
  margin-right: 50px;
}
.form-container {
  margin-top: 50px;
  display: flex;
  align-items: center;
}
</style>
<style lang="scss">
.content_right .table-page {
  .content {
    margin: 0;
  }
}
</style>
