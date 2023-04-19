const conf = {

  // 主题配置
  themeData: {},

  get(key) {
    return this[key]
  },

  set(key, value) {
    this[key] = value
  }
}

export default conf
