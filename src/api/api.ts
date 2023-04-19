import docList from './api-docs.json'
import { api } from '@/utils/dgySdk'
const VUE_APP_BASE_API:string = import.meta.env.VUE_APP_BASE_API || ''

type stringKey = Record<string, any>
let apiList:stringKey = {}
docList.forEach((docs:stringKey) => {
  let basePath = docs.basePath
  // let host = `http://${docs.host}`
  let host = ''
  for (let i in docs.tags) {
    let group:string = docs.tags[i].name
    let groupId = docs.tags[i].description.replace(/ /g, '')
    if (!apiList[groupId]) {
      apiList[groupId] = {}
    }
    for (let j in docs.paths) {
      let url = host + VUE_APP_BASE_API + basePath + j
      for (let k in docs.paths[j]) {
        // url下每个method对应的接口,k:method
        let self = docs.paths[j][k]
        if (self.tags.includes(group)) {
          let method = k
          // let operationId = self.operationId
          let operationName = j
          /**
           * 特殊路径处理
           */
          switch (operationName) {
            case '/event/daily/statistics':
              operationName = 'daily_statistics'
              break
            case '/device/device/criteria':
              operationName = 'device_criteria'
              break
            case '/led/batch/shot':
              operationName = 'batch_shot'
              break
            case '/led/device/log/{deviceId}':
              operationName = 'issued_log'
              break
            case '/radio/device/log/{deviceId}':
              operationName = 'issued_log'
              break
            case '/radio/v2/device/log/{deviceId}':
              operationName = 'issued_log'
              break
            case '/ticketSys/tickets/{ticketId}/files/{fileId}':
              operationName = 'tickets_files'
              break
            case '/alarmManagement/subscriptions/queryPage':
              operationName = 'subscriptions'
              break
            case '/radio/playlist/{playlistId}':
              operationName = 'playlist_Id'
              break
              // 个人中心接口 ---获取验证码
            case '/api/personalCenter/email/sendVerifyCode':
              operationName = 'sendVerifyCode_email'
              break
            case '/api/personalCenter/phone/sendVerifyCode':
              operationName = 'sendVerifyCode_phone'
              break
              // 个人中心接口 ---验证验证码
            case '/api/personalCenter/phone/verifyCode':
              operationName = 'verifyCode_phone'
              break
            case '/api/personalCenter/email/verifyCode':
              operationName = 'verifyCode_email'
              break
              // 个人中心接口 --- 验证邮箱验证码并绑定新的邮箱
            case '/api/personalCenter/phone/verifyAndBind':
              operationName = 'verifyAndBind_phone'
              break
            case '/api/personalCenter/email/verifyAndBind':
              operationName = 'verifyAndBind_email'
              break
            case '/chart/device/growth/rate':
              operationName = 'growth_rate'
              break
            case '/chart/online/number':
              operationName = 'online_number'
              break
            case '/chart/device/number':
              operationName = 'device_number'
              break
            case '/chart/online/growth/rate':
              operationName = 'online_growth_rate'
              break
            case '/api/user/{departCode}/pageList':
              operationName = 'departCode_pageList'
              break
            case '/api/department/{id}/tree':
              operationName = 'department_tree'
              break
            case '/api/area/{id}/tree':
              operationName = 'area_tree'
              break
            case '/device/search/device':
              operationName = 'search_device'
              break
            case '/radio/strategy/log/{radioStrategyId}':
              operationName = 'strategy_log'
              break
            case '/radio/v2/strategy/log/{radioStrategyId}':
              operationName = 'strategy_log'
              break
            case '/led/strategy/log/{ledStrategyId}':
              operationName = 'strategy_log'
              break
            case '/radio/strategy/{deviceId}/{radioSourceTypeName}':
              operationName = 'device_strategy_detail'
              break
            case '/radio/v2/strategy/{deviceId}/{radioSourceTypeName}':
              operationName = 'device_strategy_detail'
              break
            case '/batch/findCommand/byDeviceType/{deviceType}':
              operationName = 'find_command'
              break
            case '/batch/findPlatform/byDeviceType/{deviceType}':
              operationName = 'find_platform'
              break
            case '/lighting/concentrator/dimming/batch':
              operationName = 'dimming_batch'
              break
            case '/lighting/concentrator/loop/control':
              operationName = 'loop_control'
              break
            case '/lighting/concentrator/loop/control/batch':
              operationName = 'loop_batch'
              break
            case '/lighting/concentrator/group/onOrOff':
              operationName = 'group_onOrOff'
              break
            case '/lighting/concentrator/group/onOrOff/batch':
              operationName = 'group_onOrOff_batch'
              break
            case '/lighting/concentrator/group/dimming':
              operationName = 'group_dimming'
              break
            case '/lighting/concentrator/group/dimming/batch':
              operationName = 'group_dimming_batch'
              break
            case '/lighting/concentrator/onOrOff/batch':
              operationName = 'onOrOff_batch'
              break
            case '/lighting/concentrator/relay/control':
              operationName = 'relay_control'
              break
            case '/lighting/concentrator/relay/control/batch':
              operationName = 'relay_batch'
              break
            case '/lighting/concentrator/auto/batch':
              operationName = 'auto_batch'
              break
            case '/lighting/strategy/detail/page':
              operationName = 'get_detail'
              break
            case '/api/group/list':
              operationName = 'group_list'
              break
            case '/lighting/strategy/{id}/platform/list':
              operationName = 'platform_list'
              break
            case '/assets/query/criteria':
              operationName = 'filter'
              break
            case '/lighting/concentrator/loopStatus/batch':
              operationName = 'loopStatus_batch'
              break
            case '/mediaInfo/rpc/upload':
              operationName = 'rpc_upload'
              break
              // case '/led/strategy':
              //   operationName = 'strategy_v1'
              //   break
              // case '/led/strategy/isEnable/{ledStrategyId}/{isEnable}':
              //   operationName = 'isEnable_v1'
              //   break
              // 主继电器控制
            case '/lighting/concentrator/relay/host/control':
              operationName = 'relay_control_new'
              break
              // 辅继电器控制
            case '/lighting/concentrator/relay/aux/control':
              operationName = 'auxRelay_control_new'
              break
              // 批量主继电器控制
            case '/lighting/concentrator/relay/host/control/batch':
              operationName = 'relay_batch_control_new'
              break
              // 批量辅继电器控制
            case '/lighting/concentrator/relay/aux/control/batch':
              operationName = 'auxRelay_batch_control_new'
              break
              // 获取工作台面板类型
            case '/workbench/type/list':
              operationName = 'workbench_type_list'
              break
              // 地图监控（照明）地图设备请求接口
            case '/assets/ams/query':
              operationName = 'ams'
              break
              // 停止广播
            case '/radio/stop/new':
              operationName = 'stop_new'
              break
            case '/radio/v2/stop/new':
              operationName = 'stop_new'
              break
              // 设置音量
            case '/radio/volume/new':
              operationName = 'volume_new'
              break
              // 新的广播实时停止
            case '/radio/strategy/stop/{deviceId}/{radioStrategyId}':
              operationName = 'radio_stop'
              break
            case '/radio/v2/strategy/stop/{deviceId}/{radioStrategyId}':
              operationName = 'radio_stop'
              break
            case '/map/radio/v2/programPreview':
              operationName = 'v2_programPreview'
              break
              // 智慧网关查询设备平台策略
            case '/smartGateway/switchStrategy/{id}/platform/list':
              operationName = 'platform_list'
              break
            case '/camera/device/lazyTree':
              operationName = 'device_lazyTree'
              break
            case '/camera/group/lazyTree':
              operationName = 'group_lazyTree'
              break
            case '/device/valid':
              operationName = 'data_valid'
              break
            case '/api/user/changeBatchOptPassword/direct':
              operationName = 'batch_pwd_direct'
              break
            case '/api/user/changePassword/direct':
              operationName = 'login_pwd_direct'
              break
            default:
              break
          }
          operationName = operationName.replace(/{.*}/g, '')
          operationName.split('/').forEach(v => {
            if (v) {
              operationName = v
            }
          })
          let operationId:string = method + '_' + operationName
          let operation = {
            url,
            request (requestData:stringKey = {
              path: {},
              params: {},
              data: {},
              headers: {}
            }) {
              Object.assign(requestData, { url, method })
              // console.log('[API]', requestData)
              if (self.formData) {
                if (!requestData.headers) {
                  requestData.headers = {}
                }
                requestData.headers['content-type'] = 'multipart/form-data'
              }
              const request = api(requestData)
              return request
            }
          }
          // 防止重名接口覆盖
          let count = 0
          let renameOperationId = (id:string) => {
            if (apiList[groupId][id]) {
              count++
              id += '_' + count
              renameOperationId(id)
            }
            return id
          }
          operationId = renameOperationId(operationId)
          apiList[groupId][operationId] = operation
        }
      }
    }
  }
});

(window as any).Api = apiList
let apiDocs = function () {
  return apiList
}
export default apiDocs
