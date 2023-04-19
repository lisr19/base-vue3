import SDK from '@/utils/dgySdk/index.js'
const request = SDK.methods.request
const VUE_APP_BASE_API = import.meta.env.VUE_APP_BASE_API || ''

/**
 * 登录登出接口是没有swagger文档的，所以需要单独处理
 */

/**
 * 用户登录
 * @param String username
 * @param String password
 */
export function login (data:any) {
  let formData = new FormData()
  formData.append('username', data.username)
  formData.append('password', data.password)
  formData.append('type', data.type)
  return request({
    url: VUE_APP_BASE_API + '/system/login',
    method: 'post',
    data: formData,
    headers: {
      hideNotify: true
    }
  })
}

export function getInfo (token:string) {
  return request({
    url: '/web/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: VUE_APP_BASE_API + '/system/logout',
    method: 'get'
  })
}
