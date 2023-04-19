<template>
  <el-form class="phone-form" :model="newForm" ref="newFormRef" :rules="rule" @submit.native.prevent style="width: 100%; margin-top: 17px;height: 180px;">
    <el-form-item prop="newValue">
      <el-input type="text" size="large" placeholder="输入手机号" v-model="newForm.newValue"/>
    </el-form-item>
    <el-form-item prop="validCode">
      <div style="white-space: nowrap">
        <el-input size="large" type="text" placeholder="输入验证码" v-model="newForm.validCode" style="width: 264px; margin-right: 16px"/>
        <VCodeBtn :id="panelType" :ref="panelType" @click="getNewValidCode" :disabled="!canValidCode" source="login"/>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit"  size="large" :loading="isRequestLogin" class="btn">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import Reg from '@/config/reg'

const { mobile } = Reg
import {validateRule} from '@/utils/global'
import {computed, reactive, ref} from "vue";
import VCodeBtn from '@/components/ValidCodeButton'

const newForm = reactive({
  newValue: '',
  validCode: ''
})
const panelType = ref('mobile')
const isRequestLogin = ref(false)
const rule = reactive({
  validCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  newValue: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: validateRule.onlyPhone,
      trigger: 'blur'
    }
  ]
})
const canValidCode = computed(() => {
  return mobile.test(newForm.newValue)
})


const newFormRef = ref(null)
const onSubmit = async () => {
  await newFormRef.value.validate((valid) => {
    // 表单校验失败则退出
    if (valid === false) {
      return false
    }
    try {
      isRequestLogin.value = true
    } catch (e) {
    }
    isRequestLogin.value = false
  })
}
// 新手机或邮箱获取验证码
const getNewValidCode = () => {
  $Api().PhoneLoginController.get_phoneVerifyCode.request({
    params: {
      phone: newForm.newValue
    }
  })
      .then(() => {
        // this.$refs[this.panelType].downcount()
      })
}
</script>


<style lang="scss" scoped>
//.phone-form{
//  ::v-deep(.el-input__wrapper){
//    height: 44px;
//    line-height: 44px;
//  }
//}
.btn {
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  height: 44px;
  line-height: 44px;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 111111s !important;
  -webkit-transition: color 11111s ease-out, background-color 111111s ease-out !important;
}
</style>