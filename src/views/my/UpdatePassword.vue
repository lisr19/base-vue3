<template>
  <el-form :model="pwdForm" ref="pwdFormRef" :rules="userRule">
    <el-form-item :label="currentPwdMode==='login' ? '当前密码' : '当前操作密码'" prop="password"
                  :label-width="formLabelWidth">
      <el-input show-password placeholder="请输入原密码" v-model.trim="pwdForm.password" size="small"></el-input>
    </el-form-item>
    <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword" style="margin-bottom: 0">
      <el-input show-password v-model.trim="pwdForm.newPassword" placeholder="请输入新密码" size="small"></el-input>
      <div class="tip-wrapper">
        <div>
          <div class="tip-item" v-for="(tip, tipIndex) in pwdValidTipList" :key="tipIndex">
            <div class="check-box" v-if="!pwdForm.newPassword"></div>
            <div class="check-box" v-else-if="!tip.isValid">
              <el-icon color="#F56C6C">
                <CircleCloseFilled/>
              </el-icon>
            </div>
            <div class="check-box" v-else>
              <el-icon color="#67C23A">
                <SuccessFilled/>
              </el-icon>
            </div>
            <span class="tip">{{ tip.name }}</span>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
      <el-input show-password v-model.trim="pwdForm.confirmPassword"
                placeholder="确认新密码" size="small"></el-input>
    </el-form-item>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取 消</el-button>
      <el-button type="primary" @click="handleSaveChangePws" size="small">保存</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, unref} from "vue";
import Reg from "@/config/reg";
import {useUserStoreWidthOut} from "@/store/modules/user";
import {storeToRefs} from "pinia";
const {userInfo} = storeToRefs(useUserStoreWidthOut())
const emits = defineEmits(['back'])
// props
const props = defineProps({
  currentPwdMode: { type: String, default: 'login' }
})

// data
const formLabelWidth = ref('120px')
const pwdForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})
const validConfirmPwd = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的密码不一致，请重新输入'))
  } else if (value === pwdForm.password) {
    callback(new Error('修改的密码不能与原密码相同'))
  } else {
    callback()
  }
}
const userRule = reactive(
    {
      newPassword: [
        {required: true, message: '请输入新密码', trigger: 'blur'}
      ],
      confirmPassword: [
        {required: true, message: '确认新密码', trigger: 'blur'},
        {validator: validConfirmPwd, trigger: 'blur'}
      ],
      password: [
        {required: true, message: '请输入原密码', trigger: 'blur'}
      ]
    }
)
const pwdFormRef = ref(null)
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


const handleCancel = () => {
  emits('back')
  resetForm()
}
// 重置表单
const resetForm = () => {
  if (pwdFormRef) {
    unref(pwdFormRef).resetFields()
  }
}
// 修改密码
const handleSaveChangePws = () => {
  pwdFormRef.value.validate(valid => {
    // 表单校验失败则退出
    if (!validPwd()) {
      return false
    }
    if (valid === false) {
      return false
    }
    if (props.currentPwdMode === 'login') {
      $Api().TenantUserController.post_changePassword.request({
        data: {
          oldPassword: pwdForm.password,
          newPassword: pwdForm.newPassword,
          userid: userInfo.value.id
        },
      }).then(res => {
        emits('back')
      })
    } else {
      $Api().TenantUserController.post_changeBatchOptPassword.request({
        data: {
          oldBatchOptPassword: pwdForm.password,
          newBatchOptPassword: pwdForm.newPassword,
        }
      }).then(res => {
        emits('back')
      })
    }
  })
}
const validPwd = () => {
  let index = pwdValidTipList.value.findIndex(item => !item.isValid)
  console.log(index);
  return !(index >= 0)
}
</script>
<style lang="scss" scoped>
.tip-wrapper {
  margin: 8px 0;

  .tip-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 2;
  }

  .check-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    margin-right: 6px;
    color: #FFFFFF;
    font-size: 14px;
    border: 1px solid #CED1DB;
    .el-icon{
      font-size: 16px;
    }
  }

  .tip {
    color: #777777;
    font-size: 14px;
  }
}
</style>