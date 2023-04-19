import request from '@/utils/dgySdk/api/request'
export function getTagType () {
    return request({
        // url: process.env.VUE_APP_BASE_API + '/chart/tagType',
        url:'/chart/tagType',
        method: 'get'
    })
}

export function getTimeType () {

    return request({
        // url: process.env.VUE_APP_BASE_API + '/chart/timeType',
        url:'/chart/timeType',
        method: 'get'
    })
}
