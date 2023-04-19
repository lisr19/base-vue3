// vite.config.ts
import { defineConfig } from "file:///D:/%E5%BC%80%E5%8F%91%E9%A1%B9%E7%9B%AE/zkzc-base-frontend-vue3/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/%E5%BC%80%E5%8F%91%E9%A1%B9%E7%9B%AE/zkzc-base-frontend-vue3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/%E5%BC%80%E5%8F%91%E9%A1%B9%E7%9B%AE/zkzc-base-frontend-vue3/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/%E5%BC%80%E5%8F%91%E9%A1%B9%E7%9B%AE/zkzc-base-frontend-vue3/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///D:/%E5%BC%80%E5%8F%91%E9%A1%B9%E7%9B%AE/zkzc-base-frontend-vue3/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { createSvgIconsPlugin } from "file:///D:/%E5%BC%80%E5%8F%91%E9%A1%B9%E7%9B%AE/zkzc-base-frontend-vue3/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
import fs from "fs";
var __vite_injected_original_dirname = "D:\\\u5F00\u53D1\u9879\u76EE\\zkzc-base-frontend-vue3";
var resolve = (dir) => path.join(__vite_injected_original_dirname, dir);
var target = "https://island-dev2.iot-cas.com";
var vite_config_default = defineConfig(async ({ command, mode }) => {
  const optimizeDepsElementPlusIncludes = ["element-plus/es"];
  fs.readdirSync("node_modules/element-plus/es/components").map((dirname) => {
    fs.access(`node_modules/element-plus/es/components/${dirname}/style/css.mjs`, (err) => {
      if (!err) {
        optimizeDepsElementPlusIncludes.push(`element-plus/es/components/${dirname}/style/css`);
      }
    });
  });
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router"],
        resolvers: [
          ElementPlusResolver()
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver()
        ]
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      })
    ],
    define: {
      "process.env": {}
    },
    resolve: {
      alias: {
        "@": resolve("src"),
        "#": resolve("submodule")
      },
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/variables.scss";@import "@/components/zkzc-charts/src/assets/scss/animation/index.scss";'
        }
      }
    },
    server: {
      //服务器主机名
      host: "localhost",
      //端口号
      port: 9999,
      strictPort: false,
      open: false,
      //自定义代理规则
      proxy: {
        // 选项写法
        "/system": {
          target,
          changeOrigin: true
        },
        "/island-business": {
          target,
          changeOrigin: true
        },
        "/workflow": {
          target,
          changeOrigin: true
        },
        "/chart": {
          target,
          changeOrigin: true
          // change location.origin
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxcdTVGMDBcdTUzRDFcdTk4NzlcdTc2RUVcXFxcemt6Yy1iYXNlLWZyb250ZW5kLXZ1ZTNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFx1NUYwMFx1NTNEMVx1OTg3OVx1NzZFRVxcXFx6a3pjLWJhc2UtZnJvbnRlbmQtdnVlM1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovJUU1JUJDJTgwJUU1JThGJTkxJUU5JUExJUI5JUU3JTlCJUFFL3premMtYmFzZS1mcm9udGVuZC12dWUzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQge0VsZW1lbnRQbHVzUmVzb2x2ZXJ9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuXHJcbmNvbnN0IHJlc29sdmUgPSAoZGlyOiBzdHJpbmcpID0+IHBhdGguam9pbihfX2Rpcm5hbWUsIGRpcilcclxuY29uc3QgdGFyZ2V0ID0gJ2h0dHBzOi8vaXNsYW5kLWRldjIuaW90LWNhcy5jb20nIC8vIFx1NkQ0Qlx1OEJENVxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKHsgY29tbWFuZCwgbW9kZSB9KSA9PntcclxuICAgIGNvbnN0IG9wdGltaXplRGVwc0VsZW1lbnRQbHVzSW5jbHVkZXMgPSBbJ2VsZW1lbnQtcGx1cy9lcyddXHJcbiAgICBmcy5yZWFkZGlyU3luYygnbm9kZV9tb2R1bGVzL2VsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzJykubWFwKGRpcm5hbWUgPT4ge1xyXG4gICAgICBmcy5hY2Nlc3MoYG5vZGVfbW9kdWxlcy9lbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy8ke2Rpcm5hbWV9L3N0eWxlL2Nzcy5tanNgLCBlcnIgPT4ge1xyXG4gICAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgICBvcHRpbWl6ZURlcHNFbGVtZW50UGx1c0luY2x1ZGVzLnB1c2goYGVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzLyR7ZGlybmFtZX0vc3R5bGUvY3NzYClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgIHZ1ZSgpLFxyXG4gICAgICAgICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICAgICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInXSxcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgICAgICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcclxuICAgICAgICAgICAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zL3N2ZycpXSxcclxuICAgICAgICAgICAgICAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXHJcbiAgICAgICAgICAgICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJ1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgXHJcbiAgICAgICAgXSxcclxuICAgICAgICBkZWZpbmU6IHtcclxuICAgICAgICAgICAgJ3Byb2Nlc3MuZW52Jzoge31cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgICAgICdAJzogcmVzb2x2ZSgnc3JjJyksXHJcbiAgICAgICAgICAgICAgICAnIyc6IHJlc29sdmUoJ3N1Ym1vZHVsZScpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFx1NUZGRFx1NzU2NVx1NTQwRVx1N0YwMFx1NTQwRFx1NzY4NFx1OTE0RFx1N0Y2RVx1OTAwOVx1OTg3OSwgXHU2REZCXHU1MkEwIC52dWUgXHU5MDA5XHU5ODc5XHU2NUY2XHU4OTgxXHU4QkIwXHU1Rjk3XHU1MzlGXHU2NzJDXHU5RUQ4XHU4QkE0XHU1RkZEXHU3NTY1XHU3Njg0XHU5MDA5XHU5ODc5XHU0RTVGXHU4OTgxXHU2MjRCXHU1MkE4XHU1MTk5XHU1MTY1XHJcbiAgICAgICAgICAgIGV4dGVuc2lvbnM6IFsnLm1qcycsICcuanMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsICcudnVlJ11cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiQC9hc3NldHMvY3NzL3ZhcmlhYmxlcy5zY3NzXCI7QGltcG9ydCBcIkAvY29tcG9uZW50cy96a3pjLWNoYXJ0cy9zcmMvYXNzZXRzL3Njc3MvYW5pbWF0aW9uL2luZGV4LnNjc3NcIjsnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcnZlcjoge1xyXG4gICAgICAgICAgICAvL1x1NjcwRFx1NTJBMVx1NTY2OFx1NEUzQlx1NjczQVx1NTQwRFxyXG4gICAgICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcclxuICAgICAgICAgICAgLy9cdTdBRUZcdTUzRTNcdTUzRjdcclxuICAgICAgICAgICAgcG9ydDogOTk5OSxcclxuICAgICAgICAgICAgc3RyaWN0UG9ydDogZmFsc2UsXHJcbiAgICAgICAgICAgIG9wZW46IGZhbHNlLFxyXG4gICAgICAgICAgICAvL1x1ODFFQVx1NUI5QVx1NEU0OVx1NEVFM1x1NzQwNlx1ODlDNFx1NTIxOVxyXG4gICAgICAgICAgICBwcm94eToge1xyXG4gICAgICAgICAgICAgICAgLy8gXHU5MDA5XHU5ODc5XHU1MTk5XHU2Q0Q1XHJcbiAgICAgICAgICAgICAgICAnL3N5c3RlbSc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnL2lzbGFuZC1idXNpbmVzcyc6e1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICcvd29ya2Zsb3cnOntcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnL2NoYXJ0Jzoge1xyXG4gICAgICAgICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSAvLyBjaGFuZ2UgbG9jYXRpb24ub3JpZ2luXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgIFxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVQsU0FBUSxvQkFBbUI7QUFDaFYsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVEsMkJBQTBCO0FBQ2xDLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7QUFQZixJQUFNLG1DQUFtQztBQVN6QyxJQUFNLFVBQVUsQ0FBQyxRQUFnQixLQUFLLEtBQUssa0NBQVcsR0FBRztBQUN6RCxJQUFNLFNBQVM7QUFDZixJQUFPLHNCQUFRLGFBQWEsT0FBTyxFQUFFLFNBQVMsS0FBSyxNQUFLO0FBQ3BELFFBQU0sa0NBQWtDLENBQUMsaUJBQWlCO0FBQzFELEtBQUcsWUFBWSx5Q0FBeUMsRUFBRSxJQUFJLGFBQVc7QUFDdkUsT0FBRyxPQUFPLDJDQUEyQyx5QkFBeUIsU0FBTztBQUNuRixVQUFJLENBQUMsS0FBSztBQUNSLHdDQUFnQyxLQUFLLDhCQUE4QixtQkFBbUI7QUFBQSxNQUN4RjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsQ0FBQztBQUNELFNBQU87QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNMLElBQUk7QUFBQSxNQUNKLFdBQVc7QUFBQSxRQUNQLFNBQVMsQ0FBQyxPQUFPLFlBQVk7QUFBQSxRQUM3QixXQUFXO0FBQUEsVUFDUCxvQkFBb0I7QUFBQSxRQUN4QjtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1AsV0FBVztBQUFBLFVBQ1Asb0JBQW9CO0FBQUEsUUFDeEI7QUFBQSxNQUNKLENBQUM7QUFBQSxNQUNELHFCQUFxQjtBQUFBO0FBQUEsUUFFakIsVUFBVSxDQUFDLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxzQkFBc0IsQ0FBQztBQUFBO0FBQUEsUUFFOUQsVUFBVTtBQUFBLE1BQ2QsQ0FBQztBQUFBLElBRUw7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNKLGVBQWUsQ0FBQztBQUFBLElBQ3BCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxPQUFPO0FBQUEsUUFDSCxLQUFLLFFBQVEsS0FBSztBQUFBLFFBQ2xCLEtBQUssUUFBUSxXQUFXO0FBQUEsTUFDNUI7QUFBQTtBQUFBLE1BRUEsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxTQUFTLE1BQU07QUFBQSxJQUN0RTtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0QscUJBQXFCO0FBQUEsUUFDakIsTUFBTTtBQUFBLFVBQ0YsZ0JBQWdCO0FBQUEsUUFDcEI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsTUFFSixNQUFNO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQTtBQUFBLE1BRU4sT0FBTztBQUFBO0FBQUEsUUFFSCxXQUFXO0FBQUEsVUFDUDtBQUFBLFVBQ0EsY0FBYztBQUFBLFFBQ2xCO0FBQUEsUUFDQSxvQkFBbUI7QUFBQSxVQUNmO0FBQUEsVUFDQSxjQUFjO0FBQUEsUUFDbEI7QUFBQSxRQUNBLGFBQVk7QUFBQSxVQUNSO0FBQUEsVUFDQSxjQUFjO0FBQUEsUUFDbEI7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUNSO0FBQUEsVUFDQSxjQUFjO0FBQUE7QUFBQSxRQUNoQjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUVKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
