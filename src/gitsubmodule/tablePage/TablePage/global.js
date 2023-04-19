/**
 * 获取数据类型
 */
export function getDataType (data) {
  return Object.prototype.toString.call (data).slice (8, -1);
}
/**
 * 深拷贝
 */
export function deepClone (target) {
  let targetType = getDataType (target);
  let result;
  if (targetType === 'Object') {
    result = {};
  } else if (targetType === 'Array') {
    result = [];
  } else {
    return target;
  }
  for (let i in target) {
    let value = target[i];
    let valueType = getDataType (value);
    if (valueType === 'Object' || valueType === 'Array') {
      result[i] = deepClone (value);
    } else {
      result[i] = value;
    }
  }
  return result;
}
