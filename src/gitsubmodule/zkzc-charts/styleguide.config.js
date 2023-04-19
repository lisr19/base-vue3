const path = require('path')
const packageJson = require('./package.json')
// const { getComponentFiles } = require('./styleguide/config.js');

// const baseComponentsUrl = './src/components';

// 获得当前组件的目录结构
// const componentFilesDir = getComponentFiles(baseComponentsUrl);

module.exports = {
  title: 'zkzc-charts',
  require: [path.join(__dirname, 'styleguide/global.requires.js')], // 全局vue组件使用的插件
  // components: componentFilesDir,
  components: ['src/components/**/*.vue'],
  ignore: [
    'src/components/data-adorn/*.vue',
    'src/components/loading/*.vue',
    'src/components/mixins/*.vue',
    'src/components/skin/*.vue',
    'src/components/meter/svg-ring.vue'
  ],
  defaultExample: false, // 自动生成示例
  // 使用组件引入路径
  getComponentPathLine(componentPath) {
    const componentFileName = path.basename(componentPath, '.vue')
    const name =
            componentFileName.toLowerCase() === 'index'
              ? path.basename(path.dirname(componentPath))
              : componentFileName
    return `import ${name} from '${componentPath.replace(/^src\//, '/')}'`
  },

  version: packageJson.version,
  webpackConfig: require('./webpack/webpack.dev'),
  // 页面配置
  usageMode: 'expand', // 文档中属性和方法的标签初始化状态，决定是否展开
  exampleMode: 'expand', // 文档中代码示例的标签初始化状态，决定是否展开。
  copyCodeButton: true, // 代码顶部的复制按钮
  locallyRegisterComponents: true, // vue-styleguidist全局注册所有组件 多个组件共享相同的名称或如果注册了另一个组件，则组件将更改行为
  skipComponentsWithoutExample: false, // 跳过没有demo的vue组件案例
  pagePerSection: true,

  // 自定义左侧导航
  sections: [
    {
      name: '介绍',
      content: 'src/docs/introduction.md'
    },
    {
      name: '图表组件',
      sections: [
        {
          name: '柱状图',
          components: 'src/components/bar/*.vue'
        },
        {
          name: '折线图',
          components: 'src/components/line/*.vue'
        },
        {
          name: '饼图',
          components: 'src/components/pie/*.vue'
        },
        {
          name: '计数器',
          components: 'src/components/counter/*.vue'
        },
        {
          name: '数字表盘',
          components: 'src/components/meter/*.vue'
        },
        {
          name: '其他',
          components: [
            'src/components/pattern/*.vue',
            'src/components/list/*.vue'
          ]
        }
      ]

    }
  ],

  // 启动服务配置
  serverHost: '0.0.0.0',
  serverPort: 6060,

  // 打包配置
  compilerConfig: {
    target: { ie: 11 }
  },
  progressBar: true, // 打包进度条
  styleguideDir: 'docs/api', // 打包文件放置的位置
  displayOrigins: false,

  // 主题配置
  // https://github.com/styleguidist/react-styleguidist/blob/master/src/typings/RsgTheme.ts
  theme: {
    // color: {
    //   link: 'hotpink'
    // }
  }
}
