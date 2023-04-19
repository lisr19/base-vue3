/**
 * 在一个对象数组中获取对象某个属性，且以数组的形式返回
 * @param {Array} data
 * @param {Stinng} propName
 */
import SDK from '@/utils/dgySdk'
export function getDataViaProp (data:[], propName:any) {
  let arr:Recordable = []
  data.forEach(item => {
    arr.push(item[propName])
  })
  return arr
}

/**
 * 判断当前页面是否被嵌套
 * @returns {boolean}
 */
export function isInFrame () {
  return window.parent === window
}
// 平铺数组
export const flatArray = (arr:[]) => {
  let formatArr = JSON.parse(JSON.stringify(arr))
  let res:Recordable = []        // 用于存储递归结果（扁平数据）
  // 递归函数
  function fn(source:Recordable) {
    source.forEach((el:Recordable) => {
      res.push(el)
      el.children && el.children.length > 0 ? fn(el.children) : ''        // 子级递归
    })
  }
  fn(formatArr)
  return res
}
/**
 * 全屏
 */
export function fullScreen () {
  var element:any = document.documentElement // 若要全屏页面中div，var element= document.getElementById("divID");
  // IE 10及以下ActiveXObject
  if (window.ActiveXObject) {
    var WsShell = new ActiveXObject('WScript.Shell')
    WsShell.SendKeys('{F11}')
  }
  // HTML W3C 提议
  else if (element.requestFullScreen) {
    element.requestFullScreen()
  }
  // IE11
  else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
  // Webkit (works in Safari5.1 and Chrome 15)
  else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen()
  }
  // Firefox (works in nightly)
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  }
  // 派送给其他window
  // let frame = document.getElementById('bodyIframe')
  // if (frame && frame.contentWindow) {
  //   frame.contentWindow.mainEvent({
  //     type: 'isShowFrame',
  //     data: false
  //   })
  // }
  SDK.event.dispatchWSEvent({
    type: 'isShowFrame',
    data: false
  })
}

/**
 * 退出全屏
 */
export function fullExit () {
  var element:any = document.documentElement// 若要全屏页面中div，var element= document.getElementById("divID");
  // IE ActiveXObject
  if (window.ActiveXObject) {
    var WsShell = new ActiveXObject('WScript.Shell')
    WsShell.SendKeys('{F11}')
  }
  // HTML5 W3C 提议
  else if (element.requestFullScreen) {
    document.exitFullscreen()
  }
  // IE 11
  else if (element.msRequestFullscreen) {
    document.msExitFullscreen()
  }
  // Webkit (works in Safari5.1 and Chrome 15)
  else if (element.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  }
  // Firefox (works in nightly)
  else if (element.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
  // 派送给其他window
  // let frame = document.getElementById('bodyIframe')
  // if (frame && frame.contentWindow) {
  //   frame.contentWindow.mainEvent({
  //     type: 'isShowFrame',
  //     data: true
  //   })
  // }
  SDK.event.dispatchWSEvent({
    type: 'isShowFrame',
    data: true
  })
}



/**
 * @returns {string}
 */
export function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum:any = parseInt((1 + Math.random()) * 65536+'') + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone (source:any) {
  if (!source && typeof source !== 'object') {
    // throw new Error('error arguments', 'deepClone')
    throw new Error('error arguments')
  }
  const targetObj:any = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}


/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func:any, wait:number, immediate:Boolean) {
  let timeout:any, args:any, context:any, timestamp:number, result:Recordable

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args:any) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
