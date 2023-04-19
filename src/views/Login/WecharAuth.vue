<template>
  <iframe
      ref="wx_frame"
      v-if="qrShow"
      :src="qrcodeUrl"
      style="border: 0 none;margin-top:-20px"
      width="300px"
      height="310px"
      id="FF"
  ></iframe>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

const qrcodeUrl = ref(null)
const code = ref(null)
const qrShow = ref(true)

onMounted(() => {
  getWeChatCode()
})
const getWeChatCode = () => {
  const VUE_APP_BASE_API = import.meta.env.VUE_APP_BASE_API || ''
  $Api().WeChatLoginController.get_authorizedCode.request({
    params: {
      loginState:
          location.origin + VUE_APP_BASE_API + '/wechat.html'
    },
    headers: {
      noToken: true,
      hideLoading: true
    }
  }).then((res) => {
    let arr = res.split('&href=')
    let str = arr[0] +
        '&href=data:text/css;base64,' +
        'LmltcG93ZXJCb3h7IH0KLmltcG93ZXJCb3ggLnRpdGxle2Rpc3BsYXk6IG5vbmU7IH0KLmltcG93ZXJCb3ggLnFyY29kZXsgd2lkdGg6IDIyMHB4O2hlaWdodDoyMjBweH0KI3d4X2RlZmF1bHRfdGlwe29wYWNpdHk6IDAuNzsKZm9udC1mYW1pbHk6IFBpbmdGYW5nU0MtUmVndWxhcjsKZm9udC1zaXplOiAxNHB4Owpjb2xvcjogI0ZGRkZGRjtmb250LXdlaWdodDogNDAwO30K' +
        '#wechat_redirect'
    qrcodeUrl.value = str
  })
}
</script>

<style lang="scss" scoped>
.btn {
  width: 350px;
  height: 50px;
  background-color: #055fef;
  border-color: #055fef;
  border-radius: 0;
  font-size: 18px;

  &:hover {
    background-color: #1e71f7;
  }
}
</style>
