export default {

  // 域名
  domain: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,

  // 严格域名，比如http://www.baidu.com 或 https://192.168.0.1
  s_domain: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/,

  // 宽松的地址，支持相对地址
  r_domain:/[\w\-_]+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,

  // 邮箱
  email: /^[_a-z0-9-\.]+@([-a-z0-9]+\.)+[a-z]{2,}$/,

  // 手机
  mobile: /^1[3456789]\d{9}$/,

  // 姓名
  fullName: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{2,20})$/,

  // 密码
  password: /^[A-Za-z\d@$!%*#?\/<>&]+$/

}
