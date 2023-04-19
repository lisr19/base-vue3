import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import fs from 'fs'


const resolve = (dir: string) => path.join(__dirname, dir)
const target = 'https://island-dev2.iot-cas.com' // 测试
export default defineConfig(async ({ command, mode }) =>{
    const optimizeDepsElementPlusIncludes = ['element-plus/es']
    fs.readdirSync('node_modules/element-plus/es/components').map(dirname => {
      fs.access(`node_modules/element-plus/es/components/${dirname}/style/css.mjs`, err => {
        if (!err) {
          optimizeDepsElementPlusIncludes.push(`element-plus/es/components/${dirname}/style/css`)
        }
      })
    })
    return {
        plugins: [
            vue(),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [
                    ElementPlusResolver(),
                ],
            }),
            Components({
                resolvers: [
                    ElementPlusResolver(),
                ],
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]'
            }),

        ],
        define: {
            'process.env': {}
        },
        resolve: {
            alias: {
                '@': resolve('src'),
                '#': resolve('submodule')
            },
            // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        optimizeDeps: {
            include: optimizeDepsElementPlusIncludes
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/css/variables.scss";@import "@/gitsubmodule/zkzc-charts/src/assets/scss/animation/index.scss";'
                }
            }
        },
        server: {
            //服务器主机名
            host: 'localhost',
            //端口号
            port: 9999,
            strictPort: false,
            open: false,
            //自定义代理规则
            proxy: {
                // 选项写法
                '/system': {
                    target: target,
                    changeOrigin: true
                },
                '/island-business':{
                    target: target,
                    changeOrigin: true
                },
                '/workflow':{
                    target: target,
                    changeOrigin: true
                },
                '/chart': {
                  target,
                  changeOrigin: true // change location.origin
                }
            }
        }
    }

})