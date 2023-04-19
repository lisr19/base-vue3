/// <reference types="vite/client" />
declare module "*.vue" {
  import { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.js'

declare module 'nprogress'

declare module 'vue-grid-layout'

declare module 'element-resize-detector'