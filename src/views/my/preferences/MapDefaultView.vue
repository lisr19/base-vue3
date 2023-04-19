<template>
  <div class="content_right">
    <div class="content">
      <div class="tab-list">
        <div class="tab-list-item" v-for="item in tabList" :key="item.index">
          <el-radio class="tab-item-radio" v-model="curRadio" :label="item.index">
            {{ item.name }}
            <el-tooltip effect="dark" :content="item.tips" placement="top-start" :open-delay="300">
              <i class="tab-item-icon el-icon-warning-outline"></i>
            </el-tooltip>
          </el-radio>
        </div>
      </div>

      <el-form style="margin:30px 0" ref="form" :model="form" label-width="80px">
        <el-form-item label="中心位置">
          <div v-show="form.location.length" class="form-input">
            经度：{{form.location[0]}} 纬度：{{form.location[1]}}
          </div>
          <div v-show="form.location.length" class="form-textarea">
            地址：{{form.address}}
          </div>

          <el-button
            style="margin-left:15px"
            type="primary"
            size="small"
            plain
            @click="$refs.map.mapShow()"
            :disabled="isDisabled"
            icon="el-icon-location"
          >
            定位
          </el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" size="small" @click="handleSave">保存设置</el-button>
    </div>

    <!---地图定位-->
    <map-location
      ref="map"
      :lnglat="{ lng: form.location[0] || 113.550977, lat: form.location[1] || 22.760867 }"
      @setLocate="setLocate"
    />
  </div>
</template>

<script>
import MapLocation from '@/components/MapLocation/'
export default {
  name: '',
  components: {
    MapLocation
  },
  data () {
    return {
      form: {
        location: [],
        address: ''
      },
      curRadio: '',
      tabList: [
        {
          index: '1',
          name: '自定义中心位置',
          tips: '自定义中心位置指每次登录地图显示的视图位置，包含展示中心、修正坐标、地图监控，所有地图显示的视图位置'
        },
        {
          index: '2',
          name: '最近视图',
          tips:
            '最近视图指上次退出系统前地图显示的视图位置，包含展示中心、修正坐标、地图监控，所有地图显示的视图位置，系统默认为“最近视图”'
        }
      ]
    }
  },
  computed: {
    isDisabled () {
      return this.curRadio !== '1'
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取配置
    async getData () {
      const res = await this.$Api().PersonalPreferenceMapViewController.get_view.request()
      console.log(78, res)
      if (res.address && res.location.coordinates) {
        this.form = {
          location: res.location.coordinates,
          address: res.address,
          zoom: res.zoom
        }
      }
      const modeMap = { DEFINED: '1', DEFAULT: '2' }
      this.curRadio = modeMap[res.mode]
    },
    // 设置定位数据
    async setLocate (val) {
      if (this.form.location.length) {
        if (
          !(await this.$confirm('是否覆盖经纬度和地址?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }))
        ) { return }
      }
      this.form = {
        location: [val[0], val[1]],
        address: val[2],
        zoom: val[3]
      }
    },
    // 保存设置
    async handleSave () {
      const modeMap = { '1': 'DEFINED', '2': 'DEFAULT' }
      const res = await this.$Api().PersonalPreferenceMapViewController.post_view.request({
        data: {
          address: this.form.address,
          location: {
            coordinateSystemType: 'GCJ02',
            coordinates: this.form.location,
            type: 'Point'
          },
          zoom: this.form.zoom,
          mode: modeMap[this.curRadio] // 默认最近视图：DEFAULT,自定义视图：DEFINED
        }
      })
      console.log('res', res)
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
  box-sizing: border-box;
}
.content {
  padding: 24px;
}

.tab-list {
  display: flex;
  .tab-item-radio {
    display: flex;
    align-items: center;
    margin-right: 30px;
    :deep(.el-radio__inner){
        border-color: #ced1db;

      .el-radio__label {
        display: flex;
        align-items: center;
        font-size: 16px;
      }
    }
    .tab-item-icon {
      margin-left: 10px;
      font-size: 24px;
      color: #4B5869;
    }
  }
}

.form-input,
.form-textarea {
  padding: 0 15px;
  color: #0C1014;
}
.form-textarea {
  margin-bottom: 15px;
  line-height: 1.5;
}
</style>
