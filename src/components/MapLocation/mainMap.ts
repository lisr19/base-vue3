import {store} from '@/store'

let mainMap = {
  instance: null,
  container: null,
  AMap: null,
  conf: {
    center: [113.533339, 22.794258],
    resizeEnable: true,
    zooms: [3, 20],
    viewMode: '2D',
    defaultCursor: 'default',
    pitch: 30,
    mapStyle: '',
    // mapStyle: 'amap://styles/d94cca5dd4ec035d85e73a8fb1e56122',
    expandZoomRange: true,
    rotation: 0,
    zoom: 11
  },
  // 地图加载完成时回调
  completeFn: null
}

// 加载api文件
function loadJAPI () {
  // console.log('loadJAPI')
  if ((window as any).AMap) {
    (window as any)._mapLoaded()
    return
  }
  let url = 'https://webapi.amap.com/maps?v=1.4.15&key=96c44e4b9d6a4bb04b520127932bdf0e&callback=_mapLoaded'
  let jsapi = document.createElement('script')
  jsapi.charset = 'utf-8'
  jsapi.src = url
  document.head.appendChild(jsapi)
}

// api 文件加载完成，开始加载可视化文件
(window as any)._mapLoaded = function () {
  // console.log('_mapLoaded')
  if ((window as any).Loca) {
    _initMap()
    return
  }
  var url = 'https://webapi.amap.com/loca?key=96c44e4b9d6a4bb04b520127932bdf0e&v=1.3.2'
  var jsapi = document.createElement('script')
  jsapi.charset = 'utf-8'
  jsapi.src = url
  document.head.appendChild(jsapi)
  jsapi.onload = function () {
    _initMap()
  }
}

function _initMap () {
  try {
    var AMap = (window as any).AMap
    // 读取当前展示中心地图颜色配置
    if (store.state.value.setting.themeData && store.state.value.setting.themeData.id) {
      mainMap.conf.mapStyle = store.state.value.setting.themeData.mapStyle
    }

    // end
    let {
      container,
      conf,
    } = mainMap
    let map = new AMap.Map(container, conf)
    mainMap.instance = map
    mainMap.AMap = AMap
    map.on('complete', (_:any) => {
      let fn:any = mainMap.completeFn
      fn(window, mainMap.instance)
    })
  } catch (e) {
    console.log(e)
  }
}

// 初始化地图

export function initMap (conf:any, callback:any) {
  try {
  // 地图容器
    mainMap.container = conf.dom
    // 地图交互配置
    delete conf.dom
    Object.assign(mainMap.conf, conf)
    // 地图加载完成时回调
    mainMap.completeFn = callback
    // 加载api文件
    loadJAPI()
  } catch (e) {
    console.log(e)
  }
}

// 获取地图
export function getMap () {
  return mainMap.instance
}

export function getAMapObject () {
  return mainMap.AMap
}

export default getMap()
