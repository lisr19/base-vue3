import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import Router from 'vue-router'
import router from './router'
// import store from './store'
import {auth, init, userInfo} from '@/utils/dgySdk/index.js'
import {getToken, setRefreshToken} from '@/utils/getToken'

NProgress.configure({showSpinner: false}) // NProgress Configuration
// 获取字典信息
import Dict from '@/utils/getDicts'
import axios from 'axios'

const whiteList = ['/login.do', '/401', '/404', '/login', '/demo']
// pinia的setting
import {useSettingWidthOut} from '@/store/modules/setting'

const settingStore = useSettingWidthOut();
// pinia的user
import {useUserStoreWidthOut} from "@/store/modules/user"

const userStore = useUserStoreWidthOut()


// 错误提交
const reportMsg = (title: string, type: Recordable, text: string) => {
    const data = {
        title: title,
        type: type,
        text: text + ';UA=' + navigator.userAgent
    }
    axios.post('/manage/alarm/report', data)
}

router.beforeEach(async (to, from, next) => {
    // 每次路由跳转时，清除全局的遮罩
    settingStore.CLEAR_SHOWMODAL()
    if (to.path === '/404') {
        console.debug('页面跳转：', to.path, to.redirectedFrom)
        let message = `to.paht='${to.path}';to.redirectedFrom='${to.redirectedFrom}';user=${userStore.userInfo.name}`
        let reportMsg = (title: string, type: string, text?: string) => {
            var xmlhttp
            if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest()
            else xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
            xmlhttp.open('post', '/manage/alarm/report', true)
            xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            var post_data = {
                title: title,
                type: type,
                text: text + ';UA=' + navigator.userAgent
            }
            xmlhttp.send(JSON.stringify(post_data))
        }
        reportMsg('灯杆云页面跳转到404', 'CLIENT_404', message)
    }

    NProgress.start()

    if (whiteList.indexOf(to.path) !== -1) {
        // 页面在白名单中
        next()
        return
    }
    const hasInfo = !!userInfo.id
    if (hasInfo) {
        pathAuth(to, from, next)
    } else {
        try {
            await initSdk()
            pathAuth(to, from, next)
        } catch (error) {
            console.log(error)
            debugger
            next({path: '/login', query: {tenantId: userInfo.tenantId}})
        }
    }
})
// 判断是否有目录权限
const pathAuth = (to: any, from: any, next: any) => {
    // 判断是否有页面访问权限
    const accessPaths = auth.accessPaths()
    // console.log('[permission]pathAuth', accessPaths, to)
    // 目标路径有权限
    if (accessPaths.indexOf(to.path) >= 0) {
        next()
        return
    }
    // 目标路径没权限，但是权限列表有数据
    if (accessPaths.length) {
        console.error('[路由跳转无权限重定向]', to, accessPaths[0])
        let path = accessPaths[0]
        if (path.includes('/csmb')) {
            path = '/csmb'
        }
        next(path)
        return
    }
    // 没有权限，进入401
    next({path: '/401', replace: true})
}

// 初始化SDK
const initSdk = () => {
    return new Promise(async (resolve: any, reject) => {
        // TOKEN校验
        let token = getToken()
        // 验证token和时间是否过期
        if (token.token && new Date().getTime() < token.expiration) {
            setRefreshToken()
            // 初始化SDK
            await init()
            // 初始化旧字典
            await Dict()
            resolve()
        } else {
            // token过期，抛出错误
            reject(new Error('TOKEN无效'))
        }
    })
}
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
