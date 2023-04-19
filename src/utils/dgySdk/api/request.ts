import axios, { AxiosRequestConfig} from 'axios'
import JSEncrypt from 'jsencrypt'
// import store from '@/store'
import router from '@/router'
import SDK from '../index.js'
// 白名单
import { whiteList, secretList, PUBLICKEY } from '@/utils/dgySdk/api/apiConfig'

const VUE_APP_BASE_API = import.meta.env.VUE_APP_BASE_API || ''

const service = axios.create({
  baseURL: VUE_APP_BASE_API,
  timeout: 300 * 1000
})

function loadingEvent (id: number | string, show: boolean) {
  SDK.methods.loading(id, show)
}
function dialogEvent (msg: string, callback?:any) {
  SDK.methods.dialog(msg, 'error', callback)
}
function messageEvent (msg: string, showType: string) {
  SDK.methods.message(msg, showType)
}

let requestConfig:AxiosRequestConfig|null = null
// 请求拦截器
service.interceptors.request.use((config:any) => {

  requestConfig = config
  config.headers['Access-Control-Allow-Origin'] = '*'
  let token = SDK.userInfo.token

  // 是否加密接口
  let isSecretRequest = (secretList.findIndex(v => config.url === v)) >= 0
  if (isSecretRequest) {
    // 加密接口
    let formData = new FormData()
    let encryptor = new JSEncrypt()
    encryptor.setPublicKey(PUBLICKEY)
    let auth:any = encryptor.encrypt(JSON.stringify(config.data))
    formData.append('auth', auth)
    config.data = formData
  }

  // 指定接口不需要TOKEN
  if (config.headers.noToken) {
    return config
  }

  // 请求路径白名单验证，不需要验证token就可以发送
  for (let i = 0; i < whiteList.length; i++) {
    if (config?.url?config.url.indexOf(whiteList[i]) !== -1:false) {
      return config
    }
  }

  if (token) {
    config.headers['Authorization'] = token
  } else {
    if (!config.headers.hideError) {
      messageEvent('用户凭证已失效', 'error')
    }
    console.log('router', router, router.getRoutes())
    let routes = router.getRoutes()
    if (routes.map(v => v.path).includes('/login')) {
      // 如果有LOGIN路由，跳转到登录页面
      router.push('/login')
    }
    console.error('用户凭证已失效', config.url)
    return
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 接收拦截器
service.interceptors.response.use(response => {
  fitQueue(response.config)
  // 文件下载
  if (response.config.responseType === 'blob') {
    let content = response.data
    // blob内容是json，不下载
    if (response.headers['content-type'] === 'application/json;charset=UTF-8') {
      return response
    }
    let data = new Blob([content], {
      type: response.headers['content-type']
    })
    var downloadUrl = window.URL.createObjectURL(data)

    if (response.config.headers.prohibitDownload) {
      return downloadUrl
    }

    var anchor = document.createElement('a')
    anchor.href = downloadUrl
    let filename = response.headers['content-disposition'].split('=')[1]
    anchor.download = decodeURIComponent(filename)
    anchor.target = '_blank'
    anchor.click()
    window.URL.revokeObjectURL(data as any)
    return response
  }

  const res = response.data
  if (parseInt(res.code) !== 1) {
    console.error('response:', response)
    if (res.status === 'A0200') {
      // 当密码错误时特殊处理
      if (response.config.url && response.config.url.includes('login')) {
        // localStorage.clear()
        // // router.push({ path: '/login', query: { tenantId: store.state.user.userInfo.tenantId } })
        // location.href = '/?' + new Date().getTime() + '#/login?tenantId=' + store.state.user.userInfo.tenantId
        // // 跳转到login后强制刷新
        // location.reload()
        messageEvent(res.msg || 'Error', 'error')
      } else {
        // dialogEvent(res.msg, () => {
        //   localStorage.clear()
        //   location.href = '/?' + new Date().getTime() + '#/login?tenantId=' + store.state.user.userInfo.tenantId
        // })
        messageEvent(res.msg || 'Error', 'error')
        localStorage.clear()
        sessionStorage.clear()
        // location.href = '/?' + new Date().getTime() + '#/login?tenantId=' + (store.state.user.userInfo.tenantId || '')
      }
    } else {
      if (!response.config.headers.hideError) {
        // 增加一个不显示错误信息的标识
        messageEvent(res.msg || 'Error', 'error')
      }
    }
    return Promise.reject(new Error(res.msg || 'Error'))
  } else {
    if (response.config.method !== 'get' && !response.config.headers.hideNotify) {
      // post/put/del时，提示操作成功
      messageEvent(res.msg || '操作成功', 'success')
    }
    return res.data
  }
}, error => {
  fitQueue(requestConfig)
  console.error(error)
  if (error.message.includes('timeout')) {
    console.error(error, requestConfig)
    messageEvent('连接超时,请稍后再试', 'error')
    return
  }

  let status = error.response.status

  if (status === 401) {
    messageEvent('401: 会话过期，无操作权限，请重新登录' || ('Error: ' + status), 'error')
  } else if ([1000, 10004, 403].indexOf(status) > -1) {
    // 跳转到登录页面,如果在debug模式,则不跳转
    // if (/debug=/.test(location.search) === false && process.env.NODE_ENV !== 'development') {
    //   document.location.href = document.location.origin + VUE_APP_BASE_API + '/cas_login#tenantId=' + (localStorage.getItem('_tenantId') || '')
    // }
  } else {
    dialogEvent('错误：网络异常，请联系运维管理员')
  }
  return Promise.reject(error)
})

function wrapFn (this: any,requestData: Record<string, any>) {
  // 开发中禁用遮罩
  // 交互配置
  let config = requestData || {}
  // 每个请求默认开启遮罩
  // let showModal = ueConfig.showModal === undefined ? true : ueConfig.showModal
  /**
   * 请求的headers中hideLoading:true时不显示加载中遮罩，否则一律显示
   */
  let showModal = !config.headers || !config.headers.hideLoading

  if (showModal) {
    let _time = new Date().getTime()
    loadingEvent(_time, true)
    if (requestData.headers) {
      requestData.headers['_time'] = _time
    } else {
      requestData.headers = { _time }
    }
    // console.log('queue:%s  %s', _time, arguments[0].url)
  }
  return service.call(this, requestData as any)
}

// 将完成的请求从队列中去除
function fitQueue (conf:AxiosRequestConfig | null) {
  if (!conf?.headers) {
    return
  }
  loadingEvent(conf.headers['_time'], false)
}

export default wrapFn
