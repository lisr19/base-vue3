
/**
 * rang时间范围禁用
 * 限制展示一年内
 * 选择开始时间后，只能选择一个月之内的日期
 */
export function pickerOptions (limit1 = 365, limit2 = 30) {
  let _minTime: number | null = null
  let _maxTime: number | null = null
  return {
    disabledDate (time: { getTime: () => number }) {
      let curDate = (new Date()).getTime()
      let limits = limit1 * 24 * 3600 * 1000
      let befor = curDate - limits
      // 选择开始时间后，只能选择一个月之内的日期
      if (_minTime && _maxTime) {
        return time.getTime() < _minTime || time.getTime() > _maxTime
      } else {
        // 默认展示一年内
        return time.getTime() < befor
      }
    },
    onPick (time: { maxDate: any; minDate: { getTime: () => number } }) {
      // 如果选择了只选择了一个时间
      if (!time.maxDate) {
        let timeRange = limit2 * 24 * 60 * 60 * 1000

        _minTime = time.minDate.getTime() - timeRange // 最小时间
        _maxTime = time.minDate.getTime() + timeRange // 最大时间

        // 如果选了两个时间，那就清空本次范围判断数据，以备重选
      } else {
        _minTime = _maxTime = null
      }
    }
  }
}

/**
 * 单个时间范围禁用
 * 当有默认时间的时候，不建议加此方法的参数进行限制，体验不好，直接singlePickerOptions()好了
 */
export function singlePickerOptions (existingDate: VarDate, limit = 30, needType: string, defaultLimit = 365) {
  return {
    disabledDate (time: { getTime: () => number }) {
      if (existingDate) {
        let limits = limit * 24 * 3600 * 1000
        let dateTime = new Date(existingDate).getTime()
        if (needType === 'start') {
          return time.getTime() > dateTime || time.getTime() < dateTime - limits
        } else if (needType === 'end') {
          return time.getTime() > dateTime + limits || time.getTime() < dateTime
        }
      } else {
        let curDate = (new Date()).getTime()
        let befor = curDate - defaultLimit * 24 * 3600 * 1000
        return time.getTime() < befor
      }
    }
  }
}
