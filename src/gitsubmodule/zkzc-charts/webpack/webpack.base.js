// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const { srcPath } = require('./paths');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  // entry: path.join(srcPath, 'main'),
  plugins: [
    // new HtmlWebpackPlugin({
    //     template: path.join(srcPath, 'index.html'),
    //     filename: '[name].html'
    // }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // loader 的执行顺序是：从后往前
        use: [
          // MiniCssExtractPlugin.loader,
          'vue-style-loader',
          // 'stylus-loader',
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "src/assets/scss/animation/index.scss";@import "src/assets/scss/common.scss";`,
              sassOptions: {
                includePaths: [__dirname]
              }
            }
          }
        ]
      },
      {
        // 打包常规文件
        test: /\.(mp4|png|webp|svg)$/,
        type: 'asset',
        parser: {
          // 图片转为base64的条件
          dataUrlCondition: {
            // 小于100kb的图片会被base64处理
            maxSize: 100 * 1024
          }
        },
        generator: {
          filename: 'static/img/[hash:8][ext][query]'
        }
      }
    ]
  }
}
