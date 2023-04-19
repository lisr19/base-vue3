import request from '../api/api'
import {deepClone} from '@zkzc/fe-utils'

/**
 * 字典数据
 * 字典数据返回一个新的拷贝对象，避免对字典数据修改后影响原始数据
 */
let data: any[] = []
export const dictInit = () => new Promise(async (resolve:any) => {
    // [数据字典类型]获取当前租户的字典类型与字典数据树
    const option:Record<string, any> = {
        url: '/system/api/dictionaryType/all',
        method: 'get',
        params: {
            id: undefined // id
        },
        data: {},
        path: {},
        headers: {
            hideNotify: false,
            hideLoading: false,
            hideError: false,
            showInfo: false,
            'content-type': ''
        }
    }
    const res:any = await request(option)

    data = res.map((type:Recordable) => {
        type.dictionaryDTOs = type.dictionaryDTOs.map((v:Recordable) => {
            // 只需要有用字段
            const {dictLabel, id, dictSort, dictValue} = v
            return {dictLabel, id, dictSort, dictValue}
        })
        return type
    })
    resolve()
})

export const dictIndex = () => {
    const result:Recordable = {}
    data.forEach(type => {
        type.dictionaryDTOs.forEach((d:Recordable) => {
            result[d.id] = d.dictLabel
        })
    })
    return deepClone(result)
}
export const dictTree = () => {
    return deepClone(data)
}
export const alarmLevelList = () => {
    const list = data.find(v => v.id === '843154794105704448').dictionaryDTOs
    const result:Recordable = {}
    // 告警等级
    list.sort((a:Recordable, b:Recordable) => {
        return a.dictSort - b.dictSort
    })
    list.forEach((v:Recordable, i:number) => {
        result[v.id] = Object.assign(v, {index: i})
    })
    return deepClone(result)
}

export default {
    dictIndex,
    dictTree,
    alarmLevelList,
    dictInit
}
