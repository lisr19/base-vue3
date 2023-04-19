<template>
  <div class="login">
    <div
        v-if="personal.backgroundImageType == 'img'"
        class="bg"
        :style="{
        'background-image': `url(${personal.backgroundImage || '@/assets/image/login/bg.jpg'})`,
      }"
        :imgShow="imgShow"
    >
    </div>

    <template v-else>
      <video
          :src="personal.backgroundImage"
          :videoShow="videoShow"
          loop
          autoplay
          muted
          class="video"
      ></video>
    </template>
    <div class="main">
      <div class="mainBox_bg"></div>
      <div
          class="switchMode_btn"
          :class="{qrBg:toggleForm === 2}"
          @click="toggleLogin"
      ></div>

      <div class="main-logbox">
        <div class="logo-img">
          <el-image
              v-if="personal.logo"
              class="view_img"
              fit="fill"
              :src="personal.logo
            "
          />
          <div class="logo-title">{{ personal.essoTitle }}</div>
        </div>

        <div v-if="toggleForm === 1">
          <el-tabs v-model="activeName" class="demo-tabs loginbox">
            <el-tab-pane label="账号登录" name="account">
              <el-form :model="logForm" :rules="loginRules" ref="ruleFormRef" class="login-form">
                <el-form-item prop="account">
                  <el-input
                      type="text"
                      size="large"
                      placeholder="输入帐号"
                      v-model="logForm.account"
                      class="login-input"
                  >
                    <template #prefix>
                      <i  class="prefixSlot">
                        <img
                          style="width: 14px; height: 14px; margin-left: 4px"
                          src="../../assets/image/login/zh_icon.svg"
                        />
                      </i>
                    </template>

                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                      type="password"
                      size="large"
                      placeholder="输入密码"
                      v-model="logForm.password"
                      autocomplete="off"
                      @keyup.enter.native="onSubmit"
                      class="login-input"
                  >
                    <template #prefix>
                      <i  class="prefixSlot">
                        <img
                            style="width: 12px; height: 14px; margin-left: 4px"
                            src="../../assets/image/login/pwd_icon.svg"
                        />
                      </i>
                    </template>

                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                      type="primary"
                      class="btn"
                      @click="onSubmit"
                      :loading="isLoading"
                  >登录
                  </el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="手机号登录" name="phone">
              <PhoneAuth/>
            </el-tab-pane>
          </el-tabs>
        </div>
        <WecharAuth v-else/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, computed} from 'vue'
import {useUserStoreWidthOut} from "@/store/modules/user"
import PhoneAuth from './PhoneAuth'
import WecharAuth from './WecharAuth'

const userStore = useUserStoreWidthOut()
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const logForm = reactive({
  account: '',
  password: '',
  autoLogin: false
})
const loginRules = reactive({
  account: [
    {required: true, message: '请输入用户名', trigger: 'change'}
  ],
  password: [{validator: validatePass, trigger: 'change'}]
})
const ruleFormRef = ref(null)
const activeName = ref('account')
const toggleForm = ref(1)
const toggleLoginText = ref('微信扫码、手机号登录')
const imgShow = ref(false)
const videoShow = ref(false)
const isLoading = ref(false)

// 个性化配置
const personal = computed(() => {
  let esso = userStore.personal.esso
  if (esso.essoTitle) {
    document.title = esso.essoTitle
  }
  if (esso.favicon) {
    let icon = document.createElement('link')
    icon.href = esso.favicon
    icon.id = 'icon'
    document.head.appendChild(icon)
  }
  return esso
})
onMounted(() => {
  // this.$router.push("/login")
  getPersonal()
})
const getPersonal = () => {
  let tenantId = 'system'
  // 状态0表示未登录
  userStore.getPersonal({tenantId, status: 0})
}
const onSubmit = async () => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      isLoading.value = true
      userStore.login(logForm)
      isLoading.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
const toggleLogin = () => {
  if (toggleForm.value === 1) {
    toggleForm.value = 2
    toggleLoginText.value = '微信扫码登录'
  } else {
    toggleForm.value = 1
    toggleLoginText.value = '账号登录'
  }
}
</script>

<style lang="scss" scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}

.video[videoShow] {
  animation: fade-in 1s forwards;
}

.login {
  background-color: #354758;
  width: 100%;
  height: 100%;
  position: absolute;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;

  img {
    opacity: 0;
  }

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.bg[imgShow] {
  animation: fade-in 1s forwards;
}

.main {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 480px;
  height: 533px;
  margin: -267px 0 0 -240px;
  z-index: 99;
  display: flex;
  backdrop-filter: blur(10px);

  .mainBox_bg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    z-index: -1;
  }

  .switchMode_btn {
    width: 60px;
    height: 60px;
    right: 0;
    position: absolute;
    background-image: url("@/assets/image/login/switchaccount.png");

    &.qrBg {
      background-image: url("@/assets/image/login/switchqrcode.png");
    }
  }

  .main-banner {
    top: 0;
    left: 0;
    bottom: 0;
    width: 800px;
    height: 660px;
    background-color: #0041d5;
    color: #fff;

    .ad-img {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .ad {
      position: relative;

      .slogan {
        position: absolute;
        top: 50px;
        left: 48px;

        h3 {
          padding: 3px 0;
          font-size: 24px;
          border-bottom: 2px solid #fff;
          color: #fff;
        }

        p {
          margin: 0;
          padding: 6px 0 0;
          font-size: 16px;
        }

        .num {
          padding-left: 2px;
          font-family: BebasNeue;
          font-size: 26px;
          color: #fec11b;
        }
      }
    }

    .el-carousel {
      height: 100%;
    }

    .el-carousel__container {
      height: 100%;
    }

    .el-carousel__indicators {
      left: auto;
      right: 0px;
      bottom: 20px;

      .el-carousel__button {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background-color: #96b2f3;
        opacity: 1;
      }

      .is-active .el-carousel__button {
        background-color: #fec11b;
      }
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d3dce6;
    }
  }

  .main-logbox {
    padding: 40px 40px 20px 40px;
    width: 480px;
    text-align: center;

    .login-form {
      margin-top: 17px;
      height: 180px;
    }

    .logo-img {
      width: 100%;
      max-height: 200px;
      // margin: 20px auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
      }

      h1 {
        // color: $theme-color;
        font-size: 25px;
        margin-bottom: 60px;
        margin-top: 10px;
      }

      .logo-title {
        font-size: 24px;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        font-family: PingFangSC-Medium;
        margin-top: 16px;
        margin-bottom: 28px;
      }

      .view_img {
        opacity: 0;
        width: 110px;
        height: 110px;
        animation: fade-in 1s forwards;
      }
    }

    .logo {
      margin: 0 auto 20px;
      width: 270px;
      height: 160px;
      // background: url("../assets/image/login/logo.jpg") no-repeat top center;
      overflow: hidden;
      text-indent: -9999px;
    }

    .forget {
      float: right;
      color: #666;
    }

    .btn {
      width: 100%;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      border: none;
      height: 44px;
    }

    :deep(.el-tabs__item) {
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      opacity: 0.7;
      font-weight: 300;
    }

    :deep(.el-tabs__item.is-active) {
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      opacity: 1;
      font-weight: 300;
    }

    :deep(.el-tabs__active-bar) {
      background-color: white;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
      opacity: 0.36;
      background: #ced1db;
    }

    :deep(.el-form-item) {
      margin-bottom: 24px;
    }

    :deep(.el-form-item:last-child) {
      margin-bottom: 0px;
    }

    :deep(.el-input__wrapper) {
      background: hsla(0, 0%, 100%, .4) !important;
    }

    :deep(.el-input__inner) {
      color: white;
      font-weight: 300;
      font-size: 14px;

      &::placeholder {
        opacity: 0.7;
        font-weight: 300;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
    }
  }
}

:deep(.el-icon svg) {
    color: white;
}
.prefixSlot {
  display: flex;
  align-items: center;
  height: 100%;
}
.loginbox :deep(input:-webkit-autofill),
.loginbox :deep(input:-webkit-autofill:hover),
.loginbox :deep(input:-webkit-autofill:focus),
.loginbox :deep(input:-webkit-autofill:active) {
  -webkit-transition-delay: 111111s !important;
  -webkit-transition: color 11111s ease-out, background-color 111111s ease-out !important;
}
</style>