import { ElMessageBox  } from 'element-plus'


export function delText (subject = '数据') {
  return new Promise((resolve, reject) => {
    ElMessageBox.alert(`确定删除选择的${subject}吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      showCancelButton: true,
      type: 'warning'
    }).then(() => {
      resolve(true)
    }).catch(() => { reject(new Error('cancle')) })
  })
}
export function selectText (subject = '数据') {
  return new Promise((resolve, reject) => {
    (window as any).parent.frameEvent({
      type: 'message',
      msg: `请先选择${subject}再进行操作。`,
      showType: 'info'
    })
    reject(new Error('cancle'))
  })
}
export function changeText (subject = '数据', state = '启用/停用') {
  return new Promise((resolve, reject) => {
    ElMessageBox.alert(`确定${state}该${subject}吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      showCancelButton: true,
      type: 'warning'
    }).then(() => {
      resolve(true)
    }).catch(() => { reject(new Error('cancle')) })
  })
}
export function chooseLocation () {
    return new Promise((resolve, reject) => {
      ElMessageBox.alert(`是否覆盖经纬度和地址`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        resolve(true)
      }).catch(() => { reject(new Error('cancle')) })
    })
  }
