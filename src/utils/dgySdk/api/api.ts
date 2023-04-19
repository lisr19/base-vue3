import request from './request.js' // 实际项目中，改用封装的request

// 获取最终调用的函数
const requestFunc = (option:any = {}) => {
    // console.log('[API]REQUEST FUNC', option)
    if (option.path) {
        for (let i in option.path) {
            option.url = option.url.replace(`{${i}}`, option.path[i])
        }
    }
    if (option.headers) {
        const isformData = option.headers['content-type'] === 'multipart/form-data'
        if (isformData) {
            let postData = new FormData()
            for (let i in option.data) {
                postData.append(i, option.data[i])
            }
            option.data = postData
        }
    }
    return request(option)
}

export default requestFunc
