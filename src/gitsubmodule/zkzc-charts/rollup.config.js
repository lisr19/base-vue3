import nodeResolve from '@rollup/plugin-node-resolve'
import copy from 'rollup-plugin-copy'
import babel from '@rollup/plugin-babel'
import vuePlugin from 'rollup-plugin-vue'
import alias from '@rollup/plugin-alias'
import commonjs from 'rollup-plugin-commonjs'
// import image from '@rollup/plugin-image';
// import { terser } from "rollup-plugin-terser"
// import scss from 'rollup-plugin-scss'

const path = require('path')
const resolveDir = dir => path.join(__dirname, dir)
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image'
export default {
  input: './src/index.js',
  output: [{
    // 包输出目录
    dir: 'lib',
    format: 'umd',
    name: 'zkzc-charts',
    entryFileNames: '[name].umd.js',
    globals: {
      echarts: 'echarts',
      vue: 'Vue'
    }
  }, {
    // 旧的演示目录
    dir: 'demos/static',
    format: 'umd',
    name: 'zkzc-charts',
    entryFileNames: '[name].umd.js',
    globals: {
      echarts: 'echarts',
      vue: 'Vue'
    }
  }, {
    dir: 'lib',
    format: 'esm',
    name: 'zkzc-charts',
    entryFileNames: '[name].esm.js',
    globals: {
      echarts: 'echarts',
      vue: 'Vue'
    }
  }],
  external: [
    'vue',
    'element-ui',
    'echarts',
    'vue3-count-to',
    'swiper'
  ],
  plugins: [
    vuePlugin({

      style: {
        preprocessOptions: {
          scss: {
            // submodule模式下，会因为没有预加载到以下文件而报错
            data: `@import "./src/assets/scss/animation/index.scss";@import "./src/assets/scss/common.scss";`
          }
        }
      }

    }),
    nodeResolve({
      outDir: 'lib',
      jsnext: true,
      preferBuiltins: true,
      browser: true
    }),
    commonjs(), // 语法
    // image(),  // 允许导入JPG, PNG, GIF, SVG和WebP文件。
    copy({
      targets: [
        { src: 'src/static/*', dest: 'lib/static/' }
        // { src: 'src/static/**', dest: 'demos/static/asset' }
      ]
    }),
    // image({
    //   output: `lib/assets/image`,
    //   extension: /\.(png|jpg|jpeg|gif|svg)$/,
    //   limit: 8192, // 大于8k的将放到output
    //   exclude: 'node_modules/**'
    // }),
    // scss({
    //   output: 'lib/bundle.css'
    // }),
    // alias({
    //   entries: [
    //     { find: '../../static', replacement: './static' }
    //   ]
    // }),
    // terser(), //压缩

    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    postcss(),
    image()
  ]
}
