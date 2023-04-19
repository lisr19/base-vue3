
import {
    setAreaList,
    setPanelItemTypeList,
    setPanelItemOutwardMap,
    setStatisticTypeList,
    setAllDeviceListByMType,
    setDepartmentList,
    setProductionList,
    setOthersDicMapping,
    setTagTypeList
} from '@/utils/dict'
import Api from '@/api/api'
import { getTagType } from '@/api/report'
export default {
    async beforeRouteEnter (to, from, next) {
        await Api().PanelItemController.get_panelItemType.request({
            params: {
                dashboardType: 'analysis'
            }
        }).then(res => {
            setPanelItemTypeList(res)
        })
        await Api().PanelItemController.get_outward.request().then(res => {
            setPanelItemOutwardMap(res)
        })
        await Api().PanelItemController.get_statisticType.request().then(res => {
            setStatisticTypeList(res)
        })
        await Api().AreaController.get_tree.request().then(res => {
            setAreaList(res)
        })
        await Api().DepartmentController.get_tree.request().then(res => {
            setDepartmentList(res)
        })
        // await Api().DeviceController.get_list.request().then(res => {
        //   setDeviceList(res)
        // })
        await Api().PanelItemController.get_statusType.request().then(res => {
            setOthersDicMapping(res)
        })
        await Api().PanelItemController.get_allTypeModel.request().then(res => {
            setAllDeviceListByMType(res)
        })
        // 生产厂商字典
        await Api().DictionaryController.post_pageList.request({
            data: {
                condition: {
                    dictTypeId: '829054028889427968'
                },
                pageNum: 1,
                pageSize: 10000
            },
            headers: {
                hideLoading: true,
                hideNotify: true
            }
        }).then(res => {
            setProductionList(res.data)
        })
        await getTagType().then(res => {
            setTagTypeList(res)
        })
        next()
    }
    // methods: {
    //   // 进来页面前要调字典接口
    //   async getDist () {
    //     await Api().PanelItemController.get_panelItemType.request().then(res => {
    //       console.log('图表类型 res', res)
    //       setPanelItemTypeList(res)
    //     })
    //     await Api().PanelItemController.get_statisticType.request().then(res => {
    //       console.log('统计类型 res', res)
    //       setStatisticTypeList(res)
    //     })
    //     // 区域
    //     // await this.$Api().AreaController.get_tree.request().then(res => {
    //     //   console.log('区域字典 res', res)
    //     //   setAreaList(res)
    //     // })
    //   }
    // }
}
