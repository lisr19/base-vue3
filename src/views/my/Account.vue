<template>
  <div style="position:relative;">
    <div class="area-main">
      <div class="area-main-box">
        <div class="field-info">
          <div class="thumb">
            <div class="thumb-img"><img src="@/assets/image/my/userinfo-default.jpg"/></div>
          </div>
          <div class="userInfo">
            <ul>
              <li><span>账号：</span><span>{{ userInfo.loginName }}</span></li>
              <li v-if="!isEditMode">
                <span>姓名：</span>
                <span class="editable">{{ userInfo.name }}
                  <el-icon @click="handleEdit"><Edit/></el-icon>
                </span>

              </li>
              <li v-if="isEditMode">
                <span>姓名：</span>
                <el-input class="name-input" v-model="userForm.fullName" placeholder="请输入姓名"></el-input>
                <el-tooltip class="item" effect="dark" content="姓名为2-20个字母、中文或数字组成的字符" placement="top">
                  <el-button type="primary" size="small" @click="handleSaveName">保存</el-button>
                </el-tooltip>
                <el-button size="small" @click="isEditMode = false">取消</el-button>
              </li>
              <li><span>所在部门：</span><span>{{ departmentName }}</span></li>
              <li>
                <span>我拥有的角色：</span>
                <div class="tagbox" v-if="userRole.length>0">
                  <el-tag v-bind:key="item.id" v-for="item in userRole" type="success">
                    {{ (item.app ? '/' + item.app : '') + item.role }}
                  </el-tag>
                </div>
                <span v-else>无</span>
              </li>
              <li v-if="lastUpdatedTime && needUpdatedTime">
                <span>登录密码有效期：</span>
                <span>{{ lastUpdatedTime }} 至 {{ needUpdatedTime }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="field-opt">
          <table>
            <tbody>
            <tr>
              <td style="width:80px;">
                <img src="@/assets/image/my/userinfo-pwd.png"/>
              </td>
              <td style="width:450px;">
                <h4 class="title">登录密码</h4>
                <p class="desc">为保证您的账号安全，建议您定期更改密码以保护账户安全</p>
              </td>
              <td>
                <el-button type="primary" plain @click="handleChangePws('login')">修改登录密码</el-button>
              </td>
            </tr>
            <tr>
              <td style="width:80px;">
                <img src="@/assets/image/my/userinfo-pwd.png"/>
              </td>
              <td style="width:450px;">
                <h4 class="title">批量操作密码</h4>
                <p class="desc">为保证您的账号安全，建议您定期更改批量操作密码以保护账户安全</p>
              </td>
              <td>
                <el-button type="primary" plain @click="handleChangePws('batch')">修改操作密码</el-button>
              </td>
            </tr>
            <tr>
              <td>
                <img src="@/assets/image/my/userinfo-phone.png"/>
              </td>
              <td>
                <h4 class="title">绑定手机</h4>
                <p class="desc" v-if="userInfo.phoneNumber">当前已绑定手机：<span>{{ userInfo.phoneNumber }}</span></p>
                <p class="desc" v-else>当前未绑定手机号码</p>
              </td>
              <td>
                <el-button type="primary" plain @click="handleChangePhone">修改手机</el-button>
              </td>
            </tr>
            <tr>
              <td>
                <img src="@/assets/image/my/userinfo-mail.png"/>
              </td>
              <td>
                <h4 class="title">绑定邮箱</h4>
                <p class="desc" v-if="userInfo.email">当前已绑定邮箱：<span>{{ userInfo.email }}</span></p>
                <p class="desc" v-else>当前未绑定邮箱</p>
              </td>
              <td>
                <el-button type="primary" plain @click="handleChangeEmail">修改邮箱</el-button>
              </td>
            </tr>
            <tr v-if="isWechatEnable">
              <td>
                <img src="@/assets/image/my/userinfo-wechat.png"/>
              </td>
              <td>
                <h4 class="title">绑定微信</h4>
                <p class="desc" v-if="userInfo.weChatOpenId">当前已绑定微信</p>
                <p class="desc" v-else>当前未绑定微信</p>
              </td>
              <td>
                <el-button type="primary" plain v-if="userInfo.weChatOpenId" @click="handleUnbindWechat">
                  解绑微信
                </el-button>
                <el-button type="primary" plain v-else @click="handleBingWechat">绑定微信</el-button>
              </td>
            </tr>
            <tr v-if="isWechatEnable">
              <td>
                <img src="@/assets/image/my/icn-clean.png"/>
              </td>
              <td>
                <h4 class="title">清除缓存数据</h4>
                <p class="desc">清除用户的皮肤、列表和展示中心个性化数据</p>
              </td>
              <td>
                <el-button type="primary" plain @click="clearCache">清除缓存</el-button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
    <!--修改密码-->
    <el-dialog
        :title="currentPwdModeTitle"
        v-model="pwdPanelVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        @close="resetPwdForm"
        :width="isIntranet ? '500px': '900px'"
    >
      <UpdatePassword v-if="isIntranet" :currentPwdMode="currentPwdMode" @back="pwdDialogBack"/>
      <BindingPasswordPanel v-else :panelType="currentPwdMode" @back="pwdDialogBack"
                            :visible="pwdPanelVisible" ref="pwdPanelRef"></BindingPasswordPanel>
    </el-dialog>

    <!--修改手机-->
    <el-dialog
        title="修改绑定手机"
        v-model="phonePanelVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="900px">
      <BindingContactPanel panelType="mobile" @back="phonePanelVisible=false" :visible="phonePanelVisible"
                           ref="phonePanel"></BindingContactPanel>
    </el-dialog>

    <!--修改邮箱-->
    <el-dialog
        title="修改绑定邮箱"
        v-model="emailPanelVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="900px">
      <BindingContactPanel panelType="email" @back="emailPanelVisible=false" :visible="emailPanelVisible"
                           ref="emailPanel"></BindingContactPanel>
    </el-dialog>

    <el-dialog
        title="绑定微信"
        :append-to-body="true"
        width="350px"
        v-model="bindWechatVisible">
      <div style="text-align: center">
        <iframe ref="wx_frame" :src="qrcodeUrl" style="border:0 none;" width="300px" height="350px"></iframe>
      </div>
    </el-dialog>

    <el-dialog
        title="解除绑定"
        width="400px"
        :append-to-body="true"
        @close="unbindForm.password=''"
        v-model="unbindWechatVisible">
      <el-form :rules="userRule" :model="unbindForm" ref="unbindForm">
        <el-form-item label="当前密码" :label-width="formLabelWidth" prop="password" @submit.native.prevent>
          <el-input show-password v-model.trim="unbindForm.password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelUnbindWechat">取 消</el-button>
        <el-button type="primary" @click="unbindWechat">解除绑定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import BindingContactPanel from './bindingContactPanel.vue'
import BindingPasswordPanel from './bindingPasswordPanel.vue'
import UpdatePassword from './UpdatePassword.vue'
import Reg from '@/config/reg'
import {validateRule} from '@/utils/global'
import {computed, onMounted, reactive, ref} from "vue";
import {useUserStoreWidthOut} from "@/store/modules/user";

const userInfo = computed(() => {
  return $SDK.userInfo
})
const currentPwdModeTitle = computed(() => {
  let titleObj = {
    'login': '修改登录密码',
    'batch': '修改批量操作密码'
  }
  return titleObj[currentPwdMode.value]
})
const isIntranet = computed(() => {
  return false
  // return !!(sessionStorage.intranet && sessionStorage.intranet === 'true')
})

// 当前用户角色信息
let userRole = ref([])
// 是否用户信息编辑模式
const isEditMode = ref(false)
// 用户信息
let userForm = reactive({
  fullName: ''
})
const formLabelWidth = ref('120px')
const departmentName = ref(null)
const lastUpdatedTime = ref(null)
const needUpdatedTime = ref(null)
const currentPwdMode = ref(null)
const pwdPanelVisible = ref(false)
const validPhone = (rule, value, callback) => {
  let reg = Reg.mobile
  if (!reg.test(value)) {
    callback(new Error('请输入符合标准的手机号码'))
  } else {
    callback()
  }
}
const validEmail = (rule, value, callback) => {
  let reg = Reg.email
  if (!reg.test(value)) {
    callback(new Error('请输入符合标准的邮箱地址，如fobar@163.com'))
  } else {
    callback()
  }
}
const userRule = reactive({
  departmentCode: [{required: true, message: '请选择所属部门'}],
  newPhone: [
    {required: true, message: '请输入绑定手机号码', trigger: 'blur'},
    {validator: validPhone, trigger: 'blur'}
  ],
  newEmail: [
    {required: true, message: '请输入绑定邮箱', trigger: 'blur'},
    {min: 6, max: 80, message: '邮箱长度为6-80个字符', trigger: 'blur'},
    {validator: validEmail, trigger: 'blur'}
  ],
  verifCode: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入原密码', trigger: 'blur'}
  ]
})

// 微信二维码
const isWechatEnable = ref(true) // 微信功能是否启用
const bindWechatVisible = ref(false)
const unbindWechatVisible = ref(false)
const qrcodeUrl = ref(null)
const wx_frame = ref(null)
const bindForm = reactive({code: ''})

const emailPanelVisible = ref(false)
const phonePanelVisible = ref(false)
const pwdPanelRef = ref(null)
onMounted(() => {
  getRoleSetting()
  getDepatrment()
  getPasswordTime()
})


// 修改姓名
const handleEdit = () => {
  isEditMode.value = true
  userForm.fullName = userInfo.value.name
}
const handleSaveName = () => {
  let fullName = userForm.fullName
  // 校验姓名
  if (/^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/.test(fullName) === false) {
    ElMessage({message: '用户姓名不符合要求', type: 'warning'})
    return
  }
  let {loginName, phoneNumber, departmentCode, email, id} = userInfo.value
  $Api().TenantUserController.put_user.request({
    data: {
      loginName,
      name: fullName,
      phoneNumber,
      departmentCode,
      email
    },
    path: {
      id
    }
  }).then(res => {
    useUserStoreWidthOut().setFullName(fullName)
    isEditMode.value = false
  })
}

const clearCache = async () => {
  await ElMessageBox.alert(`确定清除用户缓存吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    showCancelButton: true,
    type: 'warning'
  })

  await $Api().UserCommonCacheController.delete_cache.request()
}
const handleBingWechat = () => {
  bindWechatVisible.value = true
  // 初始化二维码
  if (!qrcodeUrl.value) {
    $Api().PersonalCenterController.get_authorizedCode.request({
      params: {
        bindState: location.origin + process.env.VUE_APP_BASE_API + '/wechat.html'
      }
    }).then(res => {
      qrcodeUrl.value = res
      // 监听iframe地址变换时，获取地址参数code
      wx_frame.onload = () => {
        try {
          let url = wx_frame.contentWindow.location.href
          if (/code=/.test(url)) {
            bindForm.code = url.split(/=|&|#/)[1]
          }
        } catch (e) {
          console.log('iframe跨域，无法获取授权码。' + e)
        }
      }
    })
  }
}

// 修改邮箱
const handleChangeEmail = () => {
  let data = userInfo.value
  if (data.email || data.phoneNumber) {
    emailPanelVisible.value = true
  } else {
    // 如果当前用户没有手机和邮箱，则无法修改
    alert('您当前没有绑定任何手机和邮箱，无法进行修改，请联系管理员为您进行设置。', '系统提示')
  }
}

// 修改手机
const handleChangePhone = () => {
  let data = userInfo.value
  if (data.email || data.phoneNumber) {
    phonePanelVisible.value = true
  } else {
    alert('您当前没有绑定任何手机和邮箱，无法进行修改，请联系管理员为您进行设置。', '系统提示')
  }
}

// 获取当前用户的角色信息
const getRoleSetting = () => {
  $Api().TenantUserController.get_roles.request({
    path: {
      userid: userInfo.value.id
    }
  }).then(res => {
    let arr = []
    res.forEach(item => {
      if (item.enable) {
        arr.push({
          app: item.appInfoName,
          role: item.roleName
        })
      }
    })
    userRole.value = arr
  })
}
const getDepatrment = () => {
  $Api().DepartmentController.get_tree.request()
      .then(res => {
        let query = data => {
          data.forEach(item => {
            if (item.code === userInfo.value.departmentCode) {
              departmentName.value = item.name
            } else {
              if (item.children.length) {
                query(item.children)
              }
            }
          })
        }
        query(res.children)
      })
}

// 密码

const getPasswordTime = async () => {
  let data = $Api().TenantUserController.get_passwordValid.request({
    loading: true,
    path: {
      userId: userInfo.value.id
    }
  })
  lastUpdatedTime.value = data.lastUpdatedTime || ''
  needUpdatedTime.value = data.needUpdatedTime || ''
}
// 修改密码
const handleChangePws = (mode) => {
  currentPwdMode.value = mode
  pwdPanelVisible.value = true
}
// 重置密码表单
const resetPwdForm = () => {
  pwdPanelRef.value.resetForm()
}

const pwdDialogBack = () => {
  pwdPanelVisible.value = false
}


</script>

<style lang="scss" scoped>
.field-info {
  display: flex;
  flex-direction: row;
  padding: 44px 80px;

  .thumb {
    width: 180px;
    height: 160px;

    .thumb-img {
      width: 150px;
      height: 150px;
      border-radius: 50% 50%;
      background-color: #eef1f3;
      border: 2px solid #ddd;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .userInfo {
    padding: 10px 0 0 24px;
    flex: 1;

    li {
      padding: 5px 0;

      .el-icon-edit {
        margin-left: 4px;
        cursor: pointer;
      }
    }

    .editable {
      cursor: pointer;
    }

    .name-input {
      width: 150px;
      margin-right: 6px;
    }
  }
}

.field-opt {
  padding: 24px 80px 80px;
  border-top: 1px solid #f0f0f0;

  td {
    height: 80px;
    vertical-align: middle;
  }

  .el-button {
    margin-top: 10px;
  }

  .title {
  }

  .desc {
    margin: 4px 0 0;
    color: #b6b6b6;
  }
}

.pwd-indicator {
  ul {
    display: inline-block;
    width: 80%;
  }

  li {
    display: inline-block;
    margin-right: 3px;
    width: 32%;
    height: 9px;
    border-radius: 2px;
    line-height: 0;
    background-color: #d0d0d0;
  }

  .el-tooltip {
    margin: 0 4px;
    color: #929090;
  }

  span {

  }

  &.low {
    li:nth-child(1) {
      background-color: #f6764a;
    }
  }

  &.ok {
    li:nth-child(1),
    li:nth-child(2) {
      background-color: #d8d022;
    }
  }

  &.high {
    li {
      background-color: #88d403;
    }
  }
}

.tagbox {
  padding: 6px 0;
  width: 520px;

  .el-tag {
    margin: 2px 4px 2px 0;
  }
}
</style>
