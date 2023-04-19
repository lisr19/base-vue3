import { flatArray } from '@/utils/index'
// 字典类
let areaList = <Recordable>[]
let areaFlatList = <Recordable>[]
let departmentList = <Recordable>[]
let departmentFlatList =<Recordable>[]
let panelItemTypeList = <Recordable>[] // 图表类型
let panelItemOutwardMap = <Recordable>{} // 图表类型-外观 字典
let statisticTypeList = <Recordable>[] // 统计类型
let deviceTypeList = <Recordable>[] // 设备类型
let deviceModelList = <Recordable>[] // 设备型号
let productionList =<Recordable> [] // 生产厂商
// let statisticTypeMapping = {} // 统计类型mapping
let otherDicMapping = <Recordable>[] // 其他类型的字典库
let otherDicList = <Recordable>[] // 其他类型的字典库
let allDeviceListByMType = {} // 根据具体的ByMType查底下的设备类型和设备型号
let tagTypeList =<Recordable> [] // 报表标签
export const getMapping = (list:any[]) => {
    let mapping:any = {}
    list.forEach((value:any) => {
        mapping[value.value] = value.name
    })
    return mapping
}

export const getAreaList = () => {
    return areaList
}
export const getAreaFlatList = () => {
    return areaFlatList.map((item:Recordable) => {
        return {
            label: item.name,
            value: item.code,
            level: item.level
        }
    })
}
export const setAreaList = (list:Recordable) => {
    areaList = list
    areaFlatList = flatArray(list.children)
}
export const getDepartmentList = () => {
    return departmentList
}
export const getDepartmentFlatList = () => {
    return departmentFlatList.map((item:Recordable) => {
        return {
            label: item.name,
            value: item.code
        }
    })
}

export const setDepartmentList = (list:Recordable) => {
    departmentList = list
    departmentFlatList = flatArray(list.children)
}
export const setAllDeviceListByMType = (allListObj:Recordable) => {
    allDeviceListByMType = allListObj
}
// export const getAllDeviceListByMType = (type:Recordable) => {
//     return allDeviceListByMType[type]
// }
export const getPanelItemTypeList = () => {
    return panelItemTypeList
}
export const setPanelItemTypeList = (list:Recordable) => {
    panelItemTypeList = list
}
export const getPanelItemOutwardMap = () => {
    return panelItemOutwardMap
}
export const setPanelItemOutwardMap = (list:Recordable) => {
    panelItemOutwardMap = list
}
export const getStatisticTypeList = () => {
    return statisticTypeList
}
export const setStatisticTypeList = (list:Recordable) => {
    statisticTypeList = list
}
export const getTagTypeList = () => {
    return tagTypeList
}
export const setTagTypeList = (list:Recordable) => {
    tagTypeList = list
}
export const setDeviceList = (list:Recordable) => {
    let formatDeviceTypeList:any[] = []
    if (list && list.length) {
        list.forEach((item:any, index:number) => {
            let formatTypeList = formatDeviceTypeList.map(v => v.value)
            // 过滤掉已经添加过的
            if (formatTypeList.indexOf(item.deviceType) < 0) {
                formatDeviceTypeList.push({
                    label: item.deviceTypeName,
                    value: item.deviceType
                })
            }
        })
    }
    deviceTypeList = formatDeviceTypeList
    deviceModelList = list.map((item:Recordable) => {
        return {
            label: item.name,
            value: item.code
        }
    })
}
export const getDeviceTypeList = () => {
    return deviceTypeList
}
export const getDeviceModelList = () => {
    return deviceModelList
}
export const setProductionList = (list:Recordable[]) => {
    productionList = list.map(item => {
        return {
            label: item.dictLabel,
            value: item.id
        }
    })
}
export const getProductionList = () => {
    return productionList
}
export const setOthersDicMapping = (list:Recordable[]) => {
    otherDicList = JSON.parse(JSON.stringify(list))
    list.forEach((item) => {
        otherDicMapping[item.value] = item.children
    })
}
export const getOthersDicMapping = () => {
    return otherDicMapping
}
export const getOtherDicList = () => {
    return otherDicList
}
