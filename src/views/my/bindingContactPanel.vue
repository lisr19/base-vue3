<template>
  <div class="bindingbox">
    <el-steps :active="currStep" finish-status="success" align-center>
      <el-step title="身份验证"></el-step>
      <el-step :title="'绑定' + descDict[panelType].newLabel"></el-step>
      <el-step title="绑定成功"></el-step>
    </el-steps>
    <!--第一步-->
    <div class="main1" v-show="currStep==0">
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
              placeholder="请输验证码"
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
    <div class="main1" v-show="currStep==1">
      <el-form :model="newForm" ref="newFormRef" :rules="rule" @submit.native.prevent>
        <el-form-item
            :label="descDict[panelType].newLabel"
            :label-width="formLabelWidth"
            prop="newValue"
        >
          <el-input v-model="newForm.newValue" placeholder="请输入新邮箱" style="width:180px; margin-right:10px"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" prop="validCode">
          <el-input v-model="newForm.validCode" placeholder="请输验证码" style="width:180px; margin-right:10px"
                    size="small"></el-input>
          <v-code-btn
              :id="panelType + '02'"
              :ref="panelType + '02'"
              @click="useVerify"
              size="small"
              :disabled="!canValidCode2"
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" size="small" @click="handleBinding">开始绑定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--第三步-->
    <div class="main2" v-show="currStep==3">
      <p class="succ-tip">
        <i class="el-icon-success"></i>
        <span>已绑定新{{ descDict[panelType].label }}: {{ newForm.newValue }}</span>
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
import Reg from '@/config/reg'
import {validateRule} from '@/utils/global'
import {watch, computed, onMounted, reactive, ref, unref} from "vue";
import {useUserStoreWidthOut} from "@/store/modules/user";
import VCodeBtn from '@/components/ValidCodeButton'

// import { sendVerifyCode, verifyCode, updateMobile, updateEmail } from '@/api/account'

const emits = defineEmits(['back'])
// props
const props = defineProps({
  // 用于观察窗口是否关闭
  visible: {
    type: Boolean,
    default: false
  },
  // 修改内容类型：手机、邮箱
  panelType: { type: String, default: 'mobile' }
})
// watch
watch(() => props.visible, (newValue) => {
  if (!newValue) {
    currStep.value = 0
    resetForm()
  }
})

// computed
const userInfo = computed(() => {
  return useUserStoreWidthOut().userInfo
})
const canValidCode1 = computed(() => {
  let isValid = Reg.mobile.test(validForm.target) || Reg.email.test(validForm.target)
  return isValid
})
const canValidCode2 = computed(() => {
  let isValid = Reg.email.test(newForm.newValue)
  return isValid
})

// data
const currStep = ref(0)
const formLabelWidth = ref('140px')
let verifyResult = reactive({})
const validForm = reactive({
  target: '',
  validCode: ''
})
const newForm = reactive({
  newValue: '',
  validCode: ''
})
const validFormRef = ref(null)
const newFormRef = ref(null)
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
      validator: props.panelType === 'mobile' ? validateRule.onlyPhone : validateRule.onlyEmail,
      trigger: 'blur'
    }
  ]
})
const descDict = reactive({
  mobile: {
    label: '手机号码',
    newLabel: '新手机',
    newValueMsg: '请输入需要绑定的新手机号码'
  },
  email: {
    label: '邮箱',
    newLabel: '新邮箱',
    newValueMsg: '请输入需要绑定的新邮箱'
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
  if (newFormRef) {
    unref(newFormRef).resetFields()
  }
}

// 回到个人中心
const handleBack = () => {
  resetForm()
  currStep.value = 0
  emits('back', {})
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
const onlyPhone = (rule, value, callback) => {
  if (value === userInfo.phoneNumber) {
    callback(new Error('新手机不能与原手机号码一样'))
    return
  }
  validateRule.onlyPhone(rule, value, callback)
}
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
</style>
