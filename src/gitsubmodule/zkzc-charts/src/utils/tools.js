/**
 * 将参数转为数据格式
 * @param argument
 * @returns {*|*[]}
 */
export const toArray = (argument) => {
  const res = getType(argument) === 'array' ? argument : [argument]
  return res
}

/**
 * 获取变量的类型
 * @param {*} type
 * @returns {string}
 */
export const getType = type => {
  return Object.prototype.toString
    .call(type)
    .split(' ')[1]
    .split(']')[0]
    .toLocaleLowerCase()
}

/**
 * 将十六进制的颜色值转成rgba
 * @param {String} hex
 * @param {number} opacity
 * @returns {string}
 */
export const hexToRgba = (hex, opacity = 1, offset = 0) => {
  return `rgba(${parseInt('0x' + hex.slice(1, 3)) + offset}, ${parseInt('0x' + hex.slice(3, 5)) + offset}, ${parseInt('0x' + hex.slice(5, 7)) + offset}, ${opacity})`
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

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

  return function (...args) {
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
