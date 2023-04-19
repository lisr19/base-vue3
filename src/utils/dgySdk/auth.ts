// 定义权限信息
import { deepClone } from '@zkzc/fe-utils'
import request from './api/api'
import router from '@/router'

// 遍历菜单，并作数据整理
const travel = (data:any) => {
  let marr:any[] = []
  data.forEach((item:any) => {
    let obj:Record<string, any> = {
      path: item.url,
      name: item.caption,
      id: item.id.toString(),
      icon: item.imgCss,
      openType: item.openType
    }
    marr.push(obj)

    // 只有一个子菜单的特殊处理
    if ([100013, 100069].includes(item.id)) {
      if (item.subMenuItems.length === 1) {
        obj.openType = item.subMenuItems[0].openType
        obj.path = item.subMenuItems[0].url
        item.subMenuItems = []
      }
    }

    if (item.subMenuItems && item.subMenuItems.length) {
      obj.children = travel(item.subMenuItems)
    }
  })
  return marr
}

const getAuthMap = (data:any[], tag:string = '', caption:string = '', assignMenu:Recordable) => {
  data.forEach((item) => {
    if (tag === 'func') {
      assignMenu.func[item.id] = caption + '-' + item.caption
    } else {
      assignMenu.menu[item.id] = caption + '-' + item.caption
    }

    if (item.subMenuItems && item.subMenuItems.length > 0) {
      getAuthMap(item.subMenuItems, 'menu', assignMenu.menu[item.id], assignMenu)
    }

    if (item.subFuncItems && item.subFuncItems.length > 0) {
      getAuthMap(item.subFuncItems, 'func', assignMenu.menu[item.id], assignMenu)
    }
  })
}

// 处理菜单数据
// 特殊数据也在这里进行处理，菜单组件中只负责显示和操作
const setMenuData = (arr:Recordable) => {
  let menuData = deepClone(arr)
  const filterData = (data:Recordable) => {
    if (!data.children) {
      return
    }
    // 展示中心，不显示下级菜单
    if (data.id === '100003') {
      delete data.children
      return
    }
    // 如果子节点只有一个，不显示子节点
    // if (data.children.length === 1) {
    //   data.path = data.children[0].path
    //   delete data.children
    //   return
    // }

    // 过滤子节点和父节点路由地址相同的项
    for (let i = data.children.length - 1; i >= 0; i--) {
      data.children[i].parentNmae = data.name
      if (data.children[i].path === data.path) {
        data.children.splice(i, 1)
      } else {
        filterData(data.children[i])
      }
    }
  }
  menuData.forEach((v:Recordable) => {
    filterData(v)
  })
  // 1级菜单ID过滤
  let filterId = ['100027', '100072'] // 过滤个人中心、智能AI
  menuData = menuData.filter((v:Recordable) => !filterId.includes(v.id))

  return menuData
}

// 自定义菜单
const customMenu = (data:any) => {
  // data.push({
  //   allCaption: '嵌入测试',
  //   appName: '',
  //   caption: '嵌入测试',
  //   description: '',
  //   enable: true,
  //   id: 30324,
  //   imgCss: 'fa fa-television',
  //   openType: 'iframe',
  //   position: 5,
  //   subFuncItems: [],
  //   subMenuItems: [],
  //   url: '/dashboard/1'
  // })
  // 测试END
  return data
}
const setMenuRoute = (data:any) => {
  const addroute = (list:any[]) => {
    list.forEach(v => {
      if (v.openType === 'iframe') {
        const option:any = {
          path: v.url,
          component: () => import('@/layout/iframe.vue'),
          name: v.id,
          meta: { title: v.caption }
        }
        router.addRoute('layout', option)
      }
      if (v.subMenuItems) {
        addroute(v.subMenuItems)
      }
    })
  }
  addroute(data)
}

let menuTree:any[] = [] // 原始数据

// 没有权限数据的时候，获取权限数据
const getAccessMenu = () => {
  return new Promise(async (resolve:any, reject) => {
    // 获得菜单权限对象

    try {
      // [当前用户相关接口]用户主菜单(树形结构)
      const res:any = await request(
          {
            url: '/system/api/current/mainMenu',
            method: 'get',
            params: {
              appName: undefined // appName
            },
            data: {
            },
            path: {
            },
            headers: {
              hideNotify: false,
              hideLoading: true,
              hideError: false,
              showInfo: false,
              'content-type': ''
            }
          })
      let data = (res[0] && res[0].subMenuItems) || []
      // 自定义菜单
      menuTree = customMenu(data)
      // 增加IFRAME链接的路由
      setMenuRoute(data)
      resolve()
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

const ready = () => new Promise((resolve:any) => {
  getAccessMenu().then(() => {
    resolve()
  })
})

const getAccessPaths = (data:any[], list:any[]) => {
  data.forEach((item) => {
    // 保存到有权限的路径数组
    if (item.subMenuItems.length === 0) {
      list.push(item.url)
    }

    // 只有一个子菜单的特殊处理
    if ([100013, 100069].includes(item.id)) {
      item.subMenuItems.forEach((j:Recordable) => {
        if (j.enable) {
          list.push(j.url)
        }
      })
    }

    // 对告警管理里面的定位路由特殊处理
    if (item.url === '/operation/alarmManage') {
      item.subFuncItems.forEach((item:Recordable) => {
        if (item.caption === '定位') {
          list.push('/operation/alarmManage/alarmMap/')
        }
      })
    }

    // 对展示中心特殊处理
    if (item.url === '/csmb/device' || item.url === '/csmb/event') {
      list.push('/csmb')
    }

    if (item.subMenuItems && item.subMenuItems.length) {
      getAccessPaths(item.subMenuItems, list)
    }
  })
}

const auth = {
  authMap () {
    // 菜单权限
    const assignMenu = {
      func: {}, // 功能权限
      menu: {} // 菜单查看权限
    }
    getAuthMap(menuTree, '', '', assignMenu)
    return assignMenu
  },
  // 菜单数据，给菜单栏展示
  menuData () {
    const arr = travel(menuTree)
    return setMenuData(arr)
  },
  accessPaths () {
    const result:any[] = []
    getAccessPaths(menuTree, result)
    return result
  },
  // 菜单权限，判断是否有菜单权限
  menuAuth () {
    return travel(menuTree)
  },
  ready
}
export default auth
