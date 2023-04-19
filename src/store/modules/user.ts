import {
    login,
    logout
} from '@/api/user'
import {setToken, setUserInfo} from '@/utils/getToken'
import {store} from '@/store';
import Api from '@/api/api'

import {defineStore} from 'pinia'

// 用户的state接口
interface UserInfo {
    departmentCode?: string,
    dgyCOnfig?: Recordable,
    hasPic?: boolean,
    id?: string | number,
    idCard?: string,
    loginName?: string,
    name?: string,
    phoneNumber?: string,
    tenantId?: string,
    wechat?: string,
    weChatOpenId?: string | number,
    account?: string,
    isAdmin?: boolean,
    otherParameters?: string,
    type?: string,
    password?: string
}

// Personal的类
class Personal {
    esso: Recordable = {};
    portal: Recordable = {};
    screen: Recordable = {};
}

export const userStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: {} as UserInfo,
        personal: {
            'esso': [],
            'portal': [],
            'screen': []
        } as Personal,
        alarmNoticeType: '',
        workflowNoticeTypes: [],
        menuList:[]
    }),
    getters: {
        userid: (state) => {
            return state.userInfo.id
        },

    },
    actions: {
        SET_TOKEN(token: string) {
            this.token = token
        },
        // SET_ID: (state, id) => {
        //   state.id = id
        // },
        SET_NAME(name: string) {
            this.userInfo.name = name
        },
        // SET_ROLES: (state, role) => {
        //   state.role = role
        // },
        SET_MOBILE(phone: string) {
            this.userInfo.phoneNumber = phone
        },
        SET_EMAIL(email: string) {
            this.userInfo.weChatOpenId = email
        },
        SET_WECHAT(wechat: string | number) {
            this.userInfo.weChatOpenId = wechat
        },
        // SET_DEPARTMENT: (state, department) => {
        //   state.departmentName = department
        // },
        // SET_USERNAME: (state, username) => {
        //   state.username = username
        // },
        // SET_TENANTID: (state, value) => {
        //   state.tenantId = value || ''
        //   localStorage.setItem('_tenantId', value || '')
        // },
        SET_USERINFO(userInfo: UserInfo) {
            setUserInfo(userInfo)

            this.userInfo = userInfo
        },
        SET_PERSONAL(data: Recordable) {
            (this.personal as Recordable)[data.key] = data.value
        },
        SET_SCREEN(data: Recordable) {
            (this.personal as Recordable)[data.key] = data.value
        },
        SET_NOTICETYPE(data: string) {
            this.alarmNoticeType = data
        },
        SET_WORKFLOWNOTICETYPES(data: any) {
            this.workflowNoticeTypes = data
        },
        login(userInfo: UserInfo) {
            const {account, password} = userInfo
            return new Promise<void>((resolve, reject) => {
                login({
                    username: account ? account.trim() : '',
                    password: password,
                    type: 'business'
                }).then((data: Recordable) => {
                    let Token = {
                        token: `${data.tokenType} ${data.value}`,
                        expiration: data.expiration
                    }
                    this.SET_USERINFO(data.additionalInformation.userInfo)
                    setToken(data)
                    resolve()
                }).catch((error: Error) => {
                    reject(error)
                })
            })
        },
        // 获取个性化配置方案
        getPersonal(obj: Recordable = {}) {
            return new Promise<void>((resolve, reject) => {
                let query = {}
                let request = null

                if (obj.tenantId) {
                    query = {
                        tenantId: obj.tenantId
                    }
                    request = Api().ThemePersonalizationController.get_themeSettings.request
                } else {
                    if (obj.status === 0) {
                        request = Api().ThemePersonalizationController.get_themeSettings.request
                    } else {
                        request = Api().ThemePersonalizationController.get_personalizedSettings.request
                    }
                }
                request({
                    params: query,
                    headers: {
                        hideLoading: true
                    }
                }).then((res: any[]) => {

                    let personal: Personal = {
                        esso: {},
                        portal: {},
                        screen: {}
                    }
                    res.forEach(item => {
                        if (item.personalizationSystem === 'esso') {
                            personal.esso[item.personalizationType] = item.link
                            let type = 'img'
                            if (item.personalizationKey.indexOf('.mp4') != -1) {
                                type = 'video'
                            } else {
                                type = 'img'
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
                    this.personal = personal
                    resolve()
                })
            })
        },
        // 手机登录
        phoneLogin(newForm: Recordable) {
            const {
                newValue,
                validCode
            } = newForm
            return new Promise<void>((resolve, reject) => {
                Api()
                    .PhoneLoginController.post_login.request({
                    params: {
                        phone: newValue,
                        verifyCode: validCode
                    },
                    headers: {
                        hideLoading: true,
                        hideNotify: true
                    }
                }).then((data: Recordable) => {
                    this.SET_USERINFO(data.additionalInformation.userInfo)
                    setToken(data)
                    resolve()
                }).catch((error: Error) => {
                    reject(error)
                })
            })
        },
        // 微信登录
        wecharLogin(code: string) {
            return new Promise<void>((resolve, reject) => {
                Api()
                    .WeChatLoginController.post_login.request({
                    params: {
                        weChatCode: code
                    },
                    headers: {
                        hideLoading: true,
                        hideNotify: true
                    }
                }).then((data: Recordable) => {
                    this.SET_USERINFO(data.additionalInformation.userInfo)
                    setToken(data)
                    resolve()
                }).catch((error: Error) => {
                    reject(error)
                })
            })
        },
        // 已登录用户获取用户信息
        getInfo() {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    let userInfo = await Api().SecurityResourceController.get_userInfo.request()
                    this.SET_USERINFO(userInfo)
                    sessionStorage.userId = userInfo.id
                    sessionStorage.isAdmin = userInfo.isAdmin
                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
        },
        setFullName(value: string) {
            this.SET_NAME(value)
        },
        setMobile(value: string) {
            this.SET_MOBILE(value)
        },
        setEmail(value: string) {
            this.SET_EMAIL(value)
        },
        // 登出
        logout() {
            return new Promise<void>((resolve, reject) => {
                logout().then(() => {
                    localStorage['token_' + this.userInfo.id] = ''
                    sessionStorage.clear()
                    let tenantId = this.userInfo.tenantId
                    location.href = '/?' + new Date().getTime() + '#/login?tenantId=' + tenantId
                    resolve()
                }).catch((error: Error) => {
                    reject(error)
                })
            })
        },

    }
})


// Need to be used outside the setup
export function useUserStoreWidthOut() {
    return userStore(store);
}