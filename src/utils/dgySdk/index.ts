// 灯杆云前端框架的SDK
import userInfo from './userInfo'
import event from './event'
import auth from './auth'
import dict from './dict/index'
import api from './api/api'
import methods from './methods/index'

export const init = () => {
    return new Promise(async (resolve: any) => {
        await Promise.all(getPromiseList())

        // 定期更新数据
        setInterval(dgySdk.updateSDK, UPDATE_TIME);

        (window as any).dgySdk = dgySdk
        resolve()
    })
}

// 微应用的APPCONFIG，临时
// const appConfig = {
//   WeatherStation: {
//     entry: '//localhost:9995'
//   },
//   CentralizedController: {
//     entry: '//localhost:9995'
//   }
// }

const UPDATE_TIME = 3000000

let dgySdk: any = {
    userInfo,
    event,
    auth,
    dict,
    methods,
    api,
    updateSDK() {
        // 更新API数据
        // console.log('updateSDK')
        Promise.all(getPromiseList())
    },
    init
}
const getPromiseList = () => {
    const promiseList: any[] = []
    for (let i in dgySdk) {
        if (typeof (dgySdk[i]) === 'object' && dgySdk[i].hasOwnProperty('ready')) {
            // console.log('ready', i, dgySdk[i])
            promiseList.push(dgySdk[i].ready())
        }
    }
    return promiseList
}

export {
    api,
    userInfo,
    event,
    auth,
    dict,
    methods
}

export default dgySdk

