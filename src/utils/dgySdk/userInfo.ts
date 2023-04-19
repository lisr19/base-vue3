// 定义用户信息
import request from './api/api'
const getMapConfig = () => {
  // [业务基础服务/地图配置]查询租户地图配置
  const option:Record<string, any> = {
    url: '/island-business/map/config',
    method: 'get',
    params: {
    },
    data: {
    },
    path: {
    },
    headers: {
      hideNotify: false,
      hideLoading: false,
      hideError: false,
      showInfo: false,
      'content-type': ''
    }
  }
  return request(option)
}
const getUserInfo = () => {
  return new Promise(async (resolve:any) => {
    // [系统服务/用户认证相关接口]登录用户信息
    const option = {
      url: '/system/api/userInfo',
      method: 'get'
    }
    const res = await request(option)
    Object.assign(userInfo, res)
    // const dgyConfig = await getMapConfig()
    // userInfo.dgyConfig = dgyConfig
    resolve()
  })
}
// 获取个性化配置方案
const getPersonal = () => {
  return new Promise(async (resolve:any) => {
    // [系统服务/主题个性化相关接口]获取当前租户个性化方案
    const option = {
      url: '/system/api/theme/personalizedSettings',
      method: 'get',
      params: {
      },
      data: {
      },
      path: {
      },
      headers: {
        hideNotify: true,
        hideLoading: true,
        hideError: true,
        showInfo: true
      }
    }
    const res:any = await request(option)
    // console.log('[SDK USERINFO]', res)
    const personal:any = {
      esso: {},
      portal: {},
      screen: {}
    }
    res.forEach((item:any) => {
      if (item.personalizationSystem === 'esso') {
        personal.esso[item.personalizationType] = item.link
        var type = 'img'
        if (item.personalizationKey.indexOf('.mp4') != -1) {
          type = 'video'
        } else {
          type = 'img'
        }
        if (item.personalizationType === 'icp') {
          personal.esso[('icpTitle')] = item.title
        }
        if (item.personalizationType != 'title') {
          personal.esso[(item.personalizationType + 'Type')] = type
        } else {
          personal.esso[('essoTitle')] = item.title
        }
      } else if (item.personalizationSystem === 'portal') {
        personal.portal[item.personalizationType] = item.link
        personal.portal['portalTitle'] = item.title
      } else {
        personal.screen['screenTitle'] = item.title
      }
    })
    userInfo.personal = personal

    // 设置文档的favicon
    document.title = personal.esso.essoTitle
    if (personal.esso.favicon) {
      const icon = document.querySelector('link[rel=icon]')
      icon && icon.setAttribute('href', personal.esso.favicon)
    }

    resolve()
  })
}

const userInfo:any = {
  ready: () => new Promise(async (resolve:any) => {
    await getUserInfo()
    await getPersonal()
    resolve()
  })
}
Object.defineProperty(userInfo, 'token', {
  get () {
    if (sessionStorage.token) {
      try {
        let tokenData = JSON.parse(sessionStorage.token)
        return tokenData.token
      } catch (e) {
        console.error(e)
        return ''
      }
    }
    return ''
  }
})

export default userInfo
