<template>
  <div class="bindingbox">
    <el-steps :active="currStep" finish-status="success" align-center>
      <el-step title="身份验证"></el-step>
      <el-step :title="'重置' + descDict[panelType].newLabel"></el-step>
      <el-step title="重置成功"></el-step>
    </el-steps>

    <!--第一步-->
    <div class="main1" v-show="currStep === 0">
      <el-form :model="validForm" ref="validFormRef" :rules="rule" @submit.native.prevent>
        <el-form-item label="手机号码或邮箱" prop="target" :label-width="formLabelWidth">
          <el-input
              v-model="validForm.target"
              style="width: 305px"
              :placeholder="rule.target[0].message"
              size="small"
          ></el-input>
        </el-form-item>

        <el-form-item label="验证码" :label-width="formLabelWidth" prop="validCode">
          <el-input
              v-model="validForm.validCode"
              :placeholder="rule.validCode[0].message"
              style="width:176px; margin-right:10px"
              size="small"
          ></el-input>
          <VCodeBtn
              size="small"
              :id="panelType + '01'"
              :ref="panelType + '01'"
              @click="useVerify"
              :disabled="!canValidCode1"
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" size="small" @click="handleNextStep">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--第二步-->
    <div class="main1" v-show="currStep === 1">
      <el-form :model="pwdForm" ref="pwdForm" :rules="rule">
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword" style="margin-bottom: 0">
          <el-input show-password v-model.trim="pwdForm.newPassword" placeholder="请输入新密码" size="small"></el-input>
          <div class="tip-wrapper">
            <div>
              <div class="tip-item" v-for="(tip, tipIndex) in pwdValidTipList" :key="tipIndex">
                <div class="check-box" v-if="!pwdForm.newPassword"></div>
                <div class="check-box" v-else-if="!tip.isValid">
                  <i class="tip-icon el-icon-error"></i>
                </div>
                <div class="check-box" v-else>
                  <i class="tip-icon el-icon-success"></i>
                </div>
                <span class="tip">{{ tip.name }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input show-password v-model.trim="pwdForm.confirmPassword" placeholder="确认密码"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" size="small" @click="handleBinding">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--第三步-->
    <div class="main2" v-show="currStep === 3">
      <p class="succ-tip">
        <i class="el-icon-success"></i>
        <span>重置成功</span>
      </p>
      <p>
        <el-button type="primary" @click="handleBack">回到个人中心</el-button>
      </p>
    </div>
    <!--    <Verify @success="verifySuccess" ref="verify"></Verify>-->
  </div>
</template>

<script setup>
// import Verify from '@/components/verifition/Verify'
import VCodeBtn from '@/components/ValidCodeButton'

import Reg from '@/config/reg'
import {validateRule} from '@/utils/global'
import {computed, reactive, ref, unref, watch, onMounted} from "vue";
import {useUserStoreWidthOut} from "@/store/modules/user";

const emits = defineEmits(['back'])
// props
const props = defineProps({
  // 用于观察窗口是否关闭
  visible: {
    type: Boolean,
    default: false
  },
  panelType: { type: String, default: 'login' }
})

// computed
const userInfo = computed(() => {
  return useUserStoreWidthOut().userInfo
})
const canValidCode1 = computed(() => {
  let isValid = Reg.mobile.test(validForm.target) || Reg.email.test(validForm.target)
  return isValid
})
const pwdValidTipList = computed(() => {
  let tipList = [
    {
      name: '至少包含两种元素（字母、数字、特殊字符）',
      // 正则 字母、数字、特殊字符 两种以上
      rule: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{2,}$/,
      isValid: false
    },
    {
      name: '长度至少为6位',
      // 长度至少为6位 正则
      rule: /^.{6,}$/,
      isValid: false
    },
    {
      name: '密码应不包含空格',
      // 正则 不包含空格
      rule: /^\S+$/,
      isValid: false
    }
  ]
  tipList.forEach(item => {
    item.isValid = item.rule.test(pwdForm.newPassword)
  })
  return tipList
})

// watch
watch(() => props.visible, (newValue) => {
  if (!newValue) {
    currStep.value = 0
    resetForm()
  }
})
// data
const currStep = ref(0)
const formLabelWidth = ref('140px')
let verifyResult = reactive({})
const validForm = reactive({
  target: '',
  validCode: ''
})
const pwdForm = reactive({
  newPassword: '',
  confirmPassword: ''
})
const validFormRef = ref(null)
const onlyPhone = (rule, value, callback) => {
  if (value === userInfo.phoneNumber) {
    callback(new Error('新手机不能与原手机号码一样'))
    return
  }
  validateRule.onlyPhone(rule, value, callback)
}
const rule = reactive({
  target: [
    { required: true, message: '请输入账号绑定的手机号码或邮箱', trigger: 'blur' },
    { validator: validateRule.account, trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择一种验证方式', trigger: 'blur' }
  ],
  validCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  newValue: [
    { required: true, message: '请输入新邮箱', trigger: 'blur' },
    {
      validator: props.panelType === 'mobile' ? onlyPhone : validateRule.onlyEmail,
      trigger: 'blur'
    }
  ]
})
const descDict = reactive({
  login: {
    label: '登录密码',
    newLabel: '登录密码',
    newValueMsg: '请输入登录密码'
  },
  batch: {
    label: '操作密码',
    newLabel: '操作密码',
    newValueMsg: '请输入操作密码'
  }
})
onMounted(() => {
})
// methods
// 重置表单
const resetForm = () => {
  if (validFormRef) {
    unref(validFormRef).resetFields()
  }
}
// 回到个人中心
const handleBack = () => {
  resetForm()
  currStep.value = 0
  emits('back')
}
// 获取验证码
const getValidCode = () => {
  $Api().PersonalCenterController.get_sendVerifyCode.request({
    params: {
      ...{
        target: validForm.target
      }, ...verifyResult
    }
  }).then(res => {
    // this.$refs[this.panelType + '01'].downcount()
  })
}
// 新手机或邮箱获取验证码
const getNewValidCode = () => {
  $Api().PersonalCenterController.get_sendVerifyCode_email.request({
    params: {
      ...{
        emailAddress: newForm.newValue
      },
      ...verifyResult
    }
  }).then(res => {
    // this.$refs[this.panelType + '02'].downcount()
  })
}
// 点击下一步 时验证
const handleNextStep = () => {
  validFormRef.value.validate(valid => {
    // 表单校验失败则退出
    if (valid === false) {
      return false
    }
    $Api().PersonalCenterController.post_verifyCode.request({
      data: {
        target: validForm.target,
        verifyCode: validForm.validCode
      },
      headers: {
        hideNotify: true
      }
    }).then(res => {
      currStep.value = 1
    })
  })
}
// 开始绑定
const handleBinding = () => {
  let { newValue, validCode } = newForm

  // this.$refs['newForm'].validate(valid => {
  //   // 表单校验失败则退出
  //   if (valid === false) {
  //     return false
  //   }
  //   $Api()
  //       .PersonalCenterController.post_verifyAndBind_email.request({
  //     data: {
  //       emailAddress: newValue,
  //       verifyCode: validCode
  //     }
  //   })
  //       .then(res => {
  //         currStep.value = 3
  //         // 派发新状态到store
  //         this.$store.dispatch('user/setEmail', newValue)
  //       })
  // })
}
const verifySuccess = (result) => {
  verifyResult = result
  if (currStep.value === 0) {
    getValidCode()
  } else {
    getNewValidCode()
  }
}
const useVerify = async () => {
  // this.$refs.verify.show()
}
defineExpose({
  resetForm
})
</script>

<style lang="scss" scoped>
.bindingbox {
  padding: 10px 30px;

  .main1 {
    padding: 50px 100px 0 140px;
  }

  .main2 {
    padding: 50px;
    text-align: center;
  }

  .succ-tip {
    padding-bottom: 2em;
    color: #409eff;
    font-size: 1.2em;
  }
}

.tip-wrapper {
  margin: 8px 0;

  .tip-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 2;
  }

  .check-box {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    margin-right: 6px;
    color: #FFFFFF;
    font-size: 14px;
    border: 1px solid #CED1DB;
    text-align: left;
    position: relative;
  }

  .el-icon-error {
    color: #F56C6C;
  }

  .el-icon-success {
    color: #67C23A;

  }

  .tip-icon {
    position: absolute;
    left: -2px;
    top: -2px;
    font-size: 16px;
  }

  .tip {
    color: #777777;
    font-size: 14px;
  }
}
</style>
