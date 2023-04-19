<template>
  <el-dialog
      v-model="show"
      append-to-body
      width="600px"
      :close-on-click-modal="false"
      @close="closeDialog"
      title="地图定位"
  >
    <div class="item">
      <span style="display: inline-block;line-height: 38px;">当前地址:</span>
      <el-input v-model="addr" style="width:400px;margin-left:10px"></el-input>
      <el-button style="margin-left:10px;flex-shrink: 0;" @click="searchLoca">查找</el-button>
    </div>
    <div class="item">当前经纬度:{{ locat }}</div>
    <div id="map_location"></div>
    <template v-slot:footer class="dialog-footer">
      <el-button type="primary" @click="setLocate">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getMap,
  initMap
} from './mainMap.js'
import {computed, onMounted, onBeforeUnmount, ref, nextTick, reactive} from "vue";

const emits = defineEmits(["setLocate", 'closeDialog']);

const props = defineProps({
  lnglat: {
    type: Object,
  }
})
let geoInstance = reactive<Recordable>({})
let mapInstance = reactive<Recordable>({})
let marker = reactive<Recordable>({})
const lng = ref(null)
const lat = ref(null)
const addr = ref(null)
const show = ref(false)

const locat = computed(() => {
  return lng.value && lat.value ? `${lng.value},${lat.value}` : ''
})

onMounted(() => {
  mapShow()
})

onBeforeUnmount(() => {
  if (marker) {
    mapInstance.remove(marker)
  }
  if (!mapInstance) return
  mapInstance.destroy()
  mapInstance = {}
})

const mapShow = () => {
  show.value = true
  if (mapInstance) {
    nextTick(mapInit)
  }
}
const closeDialog = () => {
  emits('closeDialog')
}
const mapInit = () => {
  initMap({
    dom: document.getElementById('map_location'),
    center: [113.533339, 22.794258],
    zooms: [3, 18],
    zoom: 11.5,
    dragEnable: true,
    zoomEnable: true
  }, () => {
    mapInstance = getMap('map_location')
    mapInstance.on('click', mapClick)
    AMap.plugin('AMap.Geocoder', () => {
      geoInstance = new AMap.Geocoder()
      if (props.lnglat.lng !== '' && props.lnglat.lat !== '') {
        lng.value = props.lnglat.lng
        lat.value = props.lnglat.lat
        searchAddr()
      }
    })
  })
}
const mapClick = (ev: any) => {
  lng.value = ev.lnglat.lng
  lat.value = ev.lnglat.lat
  searchAddr()
  setMarker()
}
const setLocate = () => {
  emits('setLocate', [lng.value, lat.value, addr.value, mapInstance.getZoom()])
  // this.$emit('close')
  show.value = false
}
const searchLoca = () => {
  if (!addr.value) {
    return false
  }
  geoInstance.getLocation(addr.value, (status: string, result: any) => {
    if (status === 'complete' && result.geocodes.length) {
      lng.value = result.geocodes[0].location.lng
      lat.value = result.geocodes[0].location.lat
      setMarker()
    } else {
      ElMessage({
        message: '找不到输入的地址信息',
        type: 'error',
        duration: 1000
      })
    }
  })
}
const searchAddr = () => {
  setMarker()
  geoInstance.getAddress([lng.value, lat.value], (status: string, result: any) => {
    if (status === 'complete' && result.regeocode) {
      addr.value = result.regeocode.formattedAddress
    } else {
      ElMessage({
        message: '找不到选择的点所在地址信息',
        type: 'error',
        duration: 1000
      })
    }
  })
}
const setMarker = () => {
  if (marker) {
    mapInstance.remove(marker)
  }
  marker = new AMap.Marker({
    position: [lng.value, lat.value]
  })
  mapInstance.add(marker)
  mapInstance.setCenter([lng.value, lat.value])
}
</script>

<style lang="scss" scoped>
#map_location {
  width: 100%;
  height: 400px;
}

.item {
  margin-bottom: 5px;
  display: flex;
}
</style>
