const webpack = require('webpack')
const webpackCommonConf = require('./webpack.base.js')
const packageJson = require('../package.json')
const { merge } = require('webpack-merge')
// const { srcPath } = require('./paths');
const path = require('path')
const WebpackBar = require('webpackbar')

const a = merge(webpackCommonConf, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    // 包输出目录
    path: path.resolve(__dirname, '../lib'),
    publicPath: 'static',
    filename: 'index.umd.js',
    clean: true,
    library: {
      name: 'zkzc-charts',
      type: 'umd'
    }
  },
  // devServer: {
  //   historyApiFallback: true, // 前端路由配置为 history 模式时用
  //   // contentBase: distPath,    // 根目录
  //   open: false, // 自动打开浏览器
  //   compress: true, // 启动 gzip 压缩
  //   hot: true, // 热更新
  //   port: 8080, // 启动端口
  //   proxy: {}
  // },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('production'),
      process: JSON.stringify({
        VERSION: packageJson.version
      })
    }),
    new WebpackBar()
  ],
  resolve: {
    // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
    alias: {
      '@': path.join(__dirname, '../src')
    }
  },
  performance: {
    hints: 'warning', // 枚举 false关闭
    maxEntrypointSize: 100000000, // 最大入口文件大小
    maxAssetSize: 100000000, // 最大资源文件大小
    assetFilter: function(assetFilename) { // 只给出js文件的性能提示
      return assetFilename.endsWith('.js')
    }
  }
})
module.exports = a
