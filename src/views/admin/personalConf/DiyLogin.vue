<template>
  <div class="personal-login">
    <h3>预览</h3>
    <div class="preview">
      <div class="preview-win">
        <div class="head">
          <div class="tab">
            <img v-show="favicon.url" :src="favicon.url" class="fav" />
            <i class="el-icon-close tclose"></i>
            <span class="tab-angle"></span>
          </div>
          <div class="opt">
            <i class="el-icon-minus"></i>
            <i class="el-icon-full-screen"></i>
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="address"></div>
      </div>
      <div class="preview-box">
        <div
          class="bg"
          v-if="backgroundImage.type != 'video'"
          :style="{
            backgroundImage: backgroundImage.url
              ? `url('${backgroundImage.url}')`
              : 'none',
          }"
        ></div>

        <video
          :src="backgroundImage.url"
          style="width: 100%; height: 100%; object-fit: cover"
          autoplay
          loop
          muted
          v-else
        ></video>
        <div class="preview-main">
          <!-- <div
            class="main-banner"
            :style="{
              backgroundImage: imageMap.url ? `url('${imageMap.url}')` : 'none',
            }"
          > -->
          <!-- <img class="banner" :src="imageMap.url" v-show="imageMap.url"/> -->
          <!-- </div> -->
          <div class="main-logbox">
            <div
              class="logo"
              :style="{
                backgroundImage: logo.url ? `url('${logo.url}')` : 'none',
              }"
            >
              <!-- <img  :src="logo.url"  v-show="logo.url"> -->
            </div>
            <div style="margin-bottom: 10px; font-size: 12px; color: white">
              {{ pname.text }}
            </div>
            <div class="form-item"></div>
            <div class="form-item"></div>
            <div class="form-btn">登 录</div>
          </div>
        </div>
      </div>
    </div>

    <el-radio-group v-model="tabIndex" style="margin: 20px 0" size="default">
      <el-radio-button label="logo" v-if="has('100028')">logo</el-radio-button>
      <!-- <el-radio-button label="vi" v-if="has('100029')">形象图</el-radio-button> -->
      <el-radio-button label="bg" v-if="has('100030')">背景图</el-radio-button>
      <el-radio-button label="fav" v-if="has('100031')"
        >favicon</el-radio-button
      >
      <el-radio-button label="name" v-if="has('100031')"
        >平台名称</el-radio-button
      >
    </el-radio-group>

    <div v-show="tabIndex === 'logo' && has('100028')">
      <image-picker
        @choosed="setCurrProp($event, 'logo')"
        tip="可上传jpg/png文件，文件体积不超过100kb，建议尺寸110px*110px"
        :sizeLimit="100"
        system="esso"
        role="logo"
      ></image-picker>
    </div>
    <div v-show="tabIndex === 'vi' && has('100029')">
      <image-picker
        @choosed="setCurrProp($event, 'imageMap')"
        tip="可上传jpg/png文件，文件体积不超过300kb，建议尺寸720px*660px"
        :sizeLimit="300"
        system="esso"
        role="imageMap"
      ></image-picker>
    </div>
    <div v-show="tabIndex === 'bg' && has('100030')">
      <image-picker
        @choosed="setCurrProp($event, 'backgroundImage')"
        tip="可上传jpg/png/mp4文件，文件体积不超过15MB，建议尺寸1920px*1080px"
        :sizeLimit="15000"
        system="esso"
        role="backgroundImage"
      ></image-picker>
    </div>
    <div v-show="tabIndex === 'fav' && has('100031')">
      <image-picker
        @choosed="setCurrProp($event, 'favicon')"
        tip="可上传ico/png文件，文件体积不超过20kb，建议尺寸32px*32px"
        accept=".ico,.png"
        :sizeLimit="20"
        system="esso"
        role="favicon"
        :imgAlign="true"
      ></image-picker>
    </div>

    <div v-show="tabIndex === 'name' && has('100031')">
      <div style="width: 400px">
        <el-form label-width="80px">
          <el-form-item label="平台名称">
            <el-input
              v-model="pname.text"
              maxlength="10"
              show-word-limit
              @input="changeInput"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-divider></el-divider>

    <el-button @click="saveConf" type="primary" :disabled="!hasDiff"
      >保存当前配置</el-button
    >
  </div>
</template>

<script setup lang="ts">
import ImagePicker from './ImagePicker'
import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { watch, onMounted, ref, computed } from 'vue'

const props = defineProps({
    initData:{
        type: Object
    }
})

const backgroundImage = ref<Recordable>({
    url: null,
    id: null,
    orgId: null,
    type: 'img'
})

const imageMap = ref<Recordable>({
    url: null,
    id: null,
    orgId: null
})

const logo = ref<Recordable>({
    url: null,
    id: null,
    orgId: null
})

const favicon = ref<Recordable>({
    url: null,
    id: null,
    orgId: null
})
const pname = ref<Recordable>({
    text: '',
    orgText: ''
})

const tabIndex = ref('logo')


const hasDiff = () => {
      return (
        backgroundImage.value.id !== backgroundImage.value.orgId ||
        imageMap.value.id !== imageMap.value.orgId ||
        logo.value.id !== logo.value.orgId ||
        favicon.value.id !== favicon.value.orgId ||
        pname.value.text != pname.value.orgText
      )
}

const loginContent = ref<Recordable>({
    backgroundImage,
    imageMap,
    logo,
    favicon,
    pname
})

// 待
const initConf = (data:any) => {
    Object.keys(data).forEach((key) => {
    if (loginContent.value[key]) {
        loginContent.value[key] = {
        id: data[key].id,
        orgId: data[key].id,
        url: data[key].url,
        type: data[key].type
        }
    } else if (key == 'title') {
        pname.value = {
        text: data[key].title,
        orgText: data[key].title
        }
    }
    })
}

onMounted(()=>{
    initConf(props.initData)
})

const setCurrProp = (e:any, propName:string) => {
    loginContent.value[propName].url = e.url
    loginContent.value[propName].id = e.id
    loginContent.value[propName].type = e.type || 'img'
    console.log(e)
    console.log(propName)
}

const emits = defineEmits(['update'])

// 保存当前配置
const saveConf = () => {
    if (pname.value.text === '') {
        $SDK.methods.message('平台名称不能为空', 'error')
        return
    }

    let arr = [
    backgroundImage.value.id,
    imageMap.value.id,
    logo.value.id,
    favicon.value.id
    ].filter((item) => {
    return item !== null && item !== ''
    })
    var dic = {
    fileIds: arr,
    title: pname.value.text,
    typeTitleEnum: 'ESSO_title'
    }

    window.$Api()
    .ThemePersonalizationController.post_new.request({
        data: dic
    })
    .then((res:any) => {
        backgroundImage.value.orgId = backgroundImage.value.id
        imageMap.value.orgId = imageMap.value.id
        logo.value.orgId = logo.value.id
        favicon.value.orgId = favicon.value.id

        $store.dispatch('user/getPersonal')

        pname.value.orgText = pname.value.text

        emits('update')
    })
}

const changeInput = (e:any) => {
    pname.value.text = e.replace(/[^\u4e00-\u9fa5\w]/g, '')
}

</script>

<style lang="scss">
.personal-login {
  padding: 0 24px 24px;

  h3 {
    padding: 0.5em 0;
    font-size: 16px;
  }
  .preview {
    position: relative;
    padding: 10px;
    width: 640px;
    height: 380px;
    background-color: #777;
    overflow: hidden;

    .preview-win {
      height: 30px;
      border-bottom: 2px solid #fff;
      background-color: #e7eaed;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      .head {
        position: relative;
        .tab {
          position: relative;
          width: 100px;
          height: 30px;
          background-color: #fff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .tab-angle {
          position: absolute;
          right: -10px;
          bottom: 0;
          width: 10px;
          height: 10px;
          background-color: #fff;
          z-index: 0;
          overflow: hidden;
          &:after {
            content: "";
            position: absolute;
            right: -10px;
            bottom: 0;
            width: 20px;
            height: 20px;
            background-color: #e7eaed;
            z-index: 1;
            border-radius: 50%;
          }
        }
        .opt {
          position: absolute;
          right: 6px;
          top: 8px;
          i {
            margin-left: 8px;
          }
        }
        .fav {
          position: absolute;
          left: 10px;
          top: 8px;
          background-color: #fff;
          width: 16px;
          height: 16px;
        }
        .tclose {
          position: absolute;
          top: 8px;
          right: 10px;
          color: #999;
          font-weight: bold;
        }
      }
    }
    .preview-box {
      position: relative;
      height: 340px;
      background-color: #fff;
    }

    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      background-color: #f0f0f0;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .preview-main {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      // height: 250px;
      // background-color: #fff;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      overflow: hidden;
    }
    .main-banner {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 60%;
      background-color: #2f89ef;
      background-size: cover;
      background-position: center;
      // img{
      //   width:100%;
      //   height: 100%;
      // }
    }
    .main-logbox {
      // margin-left: 60%;
      padding: 27px;
      text-align: center;
      .logo {
        display: inline-block;
        margin: 12px 0 5px 0;
        width: 54px;
        height: 54px;
        // background-color: #e2e4ea;
        border: 0 none;
        outline: 0 none;
        background-size: cover;
        background-position: center;
        // img{
        //   width:100%;
        //   height:100%;
        // }
      }
      .form-item {
        margin: 0 0 8px;
        height: 20px;
        background-color: #e2e4ea;
      }
      .form-btn {
        height: 20px;
        line-height: 20px;
        color: #fff;
        background-color: #055fef;
        font-size: 12px;
      }
    }
  }
}
</style>
