// 导入所有的svg图标
import SvgIcon from '@/components/SvgIcon'
import 'virtual:svg-icons-register'

const install = (Vue) => {
  Vue.component('SvgIcon', SvgIcon)
}
// 完成svgicon的全局注册
export default install
