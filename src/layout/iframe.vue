<template>
    <iframe :src="url" class="iframe" id="bodyIframe" />
</template>
<script setup lang="ts">

import {computed} from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()

const url = computed(()=>{
  //iframeUrl为路由配置文件中添加的iframe真实路径
  //如果有真实路径，则返回真实路径
  const iframeUrl = route.meta.iframeUrl
  if( iframeUrl ){
    return iframeUrl
  }
  let url = route.path.split('/')
  let urlStr = ''
  url.forEach((v, i) => {
    // 替换csmb
    if (v === 'csmb') {
      v = 'visualization'
    }
    if (i === 1) {
      urlStr += `${v}/index.html?ver=${new Date().getTime()}#/`
    } else if (i > 0) {
      urlStr += `${v}/`
    }
  })
  let query = ''
  let params = Object.assign(route.query, route.params)
  for (let i in params) {
    if (params[i]) {
      if (query) {
        query += '&'
      }
      query += i + '=' + params[i]
    }
  }
  if (query) {
    urlStr += '?' + query
  }

  // console.log('iframe打开', urlStr)

  return urlStr
})
</script>
<style lang="scss" scoped>
.iframe{
  width: 100%;
  height: 100%;
  display: block;
  border: none;
  background-color: #f4f5f8;
}
</style>
