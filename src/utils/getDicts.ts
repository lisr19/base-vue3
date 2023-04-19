import Api from '@/api/api'

// 遍历树找对应的数据
let listFormat = (v:any[], index:Recordable) => {
  v.forEach(d => {
    index[d.code] = d.name
    if (!d.children.length) {
      // delete d.children
    } else {
      listFormat(d.children, index)
    }
  })
}

// 获取区域、部门、字典数据
// 收到更新的事件后，重新获取相应的数据
export const updateArea = async (cb: { (): void; (): void }) => {
  // 带权限（设备，设施）
  let dataDevice = {}
  var res1 = await Api().AreaController.get_tree.request({
    params: {
      groupName: 'Device',
      leastTree: true
    },
    headers: {
      hideNotify: true,
      hideLoading: true,
      hideError: true
    }
  });
  (window as any).dictData.areaTree_device = res1;
  listFormat(res1.children, dataDevice);
  (window as any).dictData.areaIndex_device = dataDevice
  // 带权限（载体）
  let datavehicle = {}
  var res2 = await Api().AreaController.get_tree.request({
    params: {
      groupName: 'Carrier',
      leastTree: true
    },
    headers: {
      hideLoading: true, hideError: true
    }
  });
  (window as any).dictData.areaTree_vehicle = res2;
  listFormat(res2.children, datavehicle);
  (window as any).dictData.areaIndex_vehicle = datavehicle
  // 不带权限
  let data = {}
  var res3 = await Api().AreaController.get_tree.request({
    headers: {
      hideLoading: true, hideError: true
    }
  });
  (window as any).dictData.areaTree = res3
  listFormat(res3.children, data);
  (window as any).dictData.areaIndex = data
  cb()
}
// 部门
export const updateDepartment = async (cb: { (): void; (): void }) => {
  // 带权限（设备，设施）
  let dataDevice = {}
  var res1 = await Api().DepartmentController.get_tree.request({
    params: {
      groupName: 'Device',
      leastTree: true
    },
    headers: {
      hideLoading: true, hideError: true
    }
  });
  (window as any).dictData.managerTree_device = res1;
  listFormat(res1.children, dataDevice);
  (window as any).dictData.managerIndex_device = dataDevice
  // 带权限（载体）
  let datavehicle = {}
  var res2 = await Api().DepartmentController.get_tree.request({
    params: {
      groupName: 'Carrier',
      leastTree: true
    },
    headers: {
      hideLoading: true, hideError: true
    }
  });
  (window as any).dictData.managerTree_vehicle = res2;
  listFormat(res2.children, datavehicle);
  (window as any).dictData.managerIndex_vehicle = datavehicle
  // 不带权限
  let data = {}
  var res3 = await Api().DepartmentController.get_tree.request({
    headers: {
      hideLoading: true, hideError: true
    }
  });
  (window as any).dictData.managerTree = res3;
  listFormat(res3.children, data);
  (window as any).dictData.managerIndex = data
  cb()
}

export const updateDict = async (cb: { (): void; (): void }) => {
  let res = await Api().DictionaryTypeController.get_all.request({
    headers: {
      hideNotify: true,
      hideLoading: true,
      hideError: true
    }
  })
  let data:Recordable = {}
  let alarmLevels: any[] = []
  res.forEach((type: { dictionaryDTOs: any[]; id: string }) => {
    type.dictionaryDTOs.forEach((d: { id: string | number; dictLabel: any }) => {
      data[d.id] = d.dictLabel
    })
    if (type.id === '843154794105704448') {
      alarmLevels = type.dictionaryDTOs
    }
  });
  (window as any).dictData.dictIndex = data;
  (window as any).dictData.dictTree = res
  // 告警等级
  alarmLevels.sort((a, b) => {
    return a.dictSort - b.dictSort
  })
  alarmLevels.forEach((v, i) => {
    (window as any).dictData.alarmLevelList[v.id] = Object.assign(v, { index: i })
  })
  cb()
}


let formData:Recordable = {}
export default () => {
  return new Promise((resolve) => {
    let loadCount = 10
    let completeCount = () => {
      loadCount--
      // console.log('加载基础数据完成', loadCount)
      if (loadCount === 0) {
        resolve('done')
      }
    }
   

    let updateData = async () => {
      // console.log('加载基础数据')
      loadCount = 9
      // /**
      //  * 自定义表单，放在型号中，是因为需要型号数据读取配置属性
      //  */
      // let res = await Api().FormConfigController.post_batch.request({
      //   data: {
      //     businessType: ''
      //   },
      //   headers: {
      //     hideLoading: true,
      //     hideError: true,
      //     hideNotify: true
      //   }
      // })
      // res.forEach((v: { businessId: string | number; form: any }) => {
      //   formData[v.businessId] = v.form
      // })

      updateArea(completeCount)
      updateDepartment(completeCount)
      updateDict(completeCount)
     
    }
    // 每3分钟更新一次
    setInterval(updateData, 30000)
    updateData()
    resolve('done')
  })
}

if (window.parent !== window) {
  (window as any).dictData = (window as any).parent.dictData
} else {
  (window as any).dictData = {
    areaTree: {},
    areaIndex: {},
    areaTree_device: {},
    areaIndex_device: {},
    areaTree_vehicle: {},
    areaIndex_vehicle: {},
    managerTree_device: {},
    managerIndex_device: {},
    managerTree_vehicle: {},
    managerIndex_vehicle: {},
    managerTree: {},
    managerIndex: {},
    dictIndex: {},
    dictTree: {},
    productModel: {},
    productModelNA: {},
    deviceTypeList: {},
    // deviceModel: {},
    deviceTypeListNA: {},
    // deviceModelNA: {},
    vehicleIndex: {},
    facilityTypeList: {},
    facilityTypeListNA: {},
    facilityModelList: {},
    facilityModelListNA: {},
    vehicleIndexNA: {},
    vehicleTypeList: {},
    vehicleTypeListNA: {},
    vehicleModelList: {},
    vehicleModelListNA: {},
    alarmTypesList: {},
    alarmTypesListById: {},
    alarmTypesListArray: [],
    alarmLevelList: {},
    workFlow: {},
    driverCodeIndex: {}// 地图图标使用到的productCode->driverCode索引
  }
}

export let discData = (window as any).dictData
