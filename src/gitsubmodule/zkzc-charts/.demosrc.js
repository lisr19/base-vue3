export default {
  devServer: {
    port: 9090,
  },
  output: {
    dir: 'docs/demos', // 配置构建部署时输出的目录，默认dist目录
    publicUrl: '.', // 配置构建输出的资源根目录，默认是'/'
    html: {
      title: 'zkzc-charts'
    },
  },
  themeFile: 'demos/theme.scss',
  staticFolder: 'demos/static',
  demoList: '.demoList.json',
  name: 'zkzc-charts',
  version: '0.2',
  homePage: 'https://lbs.iot-cas.com/zkzc-charts/index.html',
  logo: '',
  boxTheme: 'merbivoreSoft', // monokai, merbivoreSoft, krtheme, brillianceBlack, allHallowsEve
  globalPackages: {
    // 加载公共js模块
    js: [
      'cdn/vue.min.js',
      'cdn/echarts.min.js'
    ],
    css: [],
  },
  // tab waterfall
  editorViewMode: 'tab', // 配置代码块的UI展示方式，现在支持tab和waterfall两种展示方式
  editorLayout: 'reverse', // 配置画布与代码的位置关系，支持normal和reverse两种配置
  editorOptions: {
    disableLayerHinting: true,
  }
};
