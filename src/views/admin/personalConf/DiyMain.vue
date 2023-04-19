<template>
  <div class="personal-main">
    <h3>预览</h3>
    <div class="preview">
      <div class="preview-win">
        <div class="head">
          <div class="tab">
            <img v-show="favIcon" :src="favIcon" class="fav" />
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
      <div class="preview-head">
        <div class="logo">
          <img
            :src="logo.url"
            v-show="logo.url"
            style="width: 20px; height: 20px; margin-left: 5px"
          />
          <div style="margin-left: 4px; font-size: 11px">{{ pname.text }}</div>
        </div>
      </div>
      <div class="preview-main">
        <div class="side">
          <ul>
            <li v-for="index in 5" :key="index"></li>
          </ul>
        </div>
        <div class="content">
          <ul>
            <li v-for="index in 5" :key="index"></li>
          </ul>
        </div>
      </div>
    </div>
    <el-radio-group v-model="tabIndex" style="margin: 20px 0" size="default">
      <el-radio-button label="logo" v-if="has('100032')">logo</el-radio-button>
      <el-radio-button label="name" v-if="has('100032')"
        >平台名称</el-radio-button
      >

      <!-- <el-radio-button label="fav" v-if="has('100033')">favicon</el-radio-button> -->
    </el-radio-group>

    <div v-show="tabIndex === 'logo' && has('100032')">
      <image-picker
        @choosed="setCurrProp($event, 'logo')"
        tip="可上传jpg/png文件，文件体积不超过100kb，建议尺寸36px*36px"
        :sizeLimit="100"
        system="portal"
        role="logo"
      ></image-picker>
    </div>
    <div v-show="tabIndex === 'fav' && has('100033')">
      <image-picker
        @choosed="setCurrProp($event, 'favicon')"
        tip="可上传ico/png文件，文件体积不超过20kb，建议尺寸32px*32px"
        accept=".ico,.png"
        :sizeLimit="20"
        system="portal"
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
              maxlength="7"
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

<script lang="ts" setup>
import ImagePicker from './ImagePicker'
import {getAuthTableFunctions,authTableFunctions,has} from '@/utils/auth.ts'
import { watch, onMounted, ref, computed } from 'vue'

const props = defineProps({
    initData:{
        type:Object
    }
})

const tabIndex = ref('logo')

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

const emits = defineEmits(['update'])

const hasDiff = computed(()=>{
    return (
        logo.value.id !== logo.value.orgId ||
        favicon.value.id !== favicon.value.orgId ||
        pname.value.text != pname.value.orgText
      )
})

const favIcon = computed(()=>{
    console.log(window.$store);
      let esso = window.$store.state.value.user.personal.esso
      return esso.favicon
})

const loginContent = ref<Recordable>({
    logo,
    favicon,
    pname
})

const initConf = (data:any) => {
    Object.keys(data).forEach((key) => {
    if (loginContent.value[key]) {
        loginContent.value[key] = {
        id: data[key].id,
        orgId: data[key].id,
        url: data[key].url
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


const setCurrProp = (event:any, propName:any) => {
    loginContent.value[propName].url = event.url
    loginContent.value[propName].id = event.id
}

const saveConf =  () => {
    if (pname.value.text == '') {
    window.$SDK.methods.message('平台名称不能为空', 'error')
    return
    }
    let arr = [logo.value.id, favicon.value.id].filter((item) => {
    return item !== null && item !== ''
    })

    var dic = {
    fileIds: arr,
    title: pname.value.text,
    typeTitleEnum: 'PORTAL_title'
    }
    window.$Api()
    .ThemePersonalizationController.post_new.request({
        data: dic
    })
    .then(() => {
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

<style lang="scss" scoped>
.personal-main {
  padding: 0 24px 24px;

  h3 {
    padding: 0.5em 0;
    font-size: 16px;
  }
  .preview {
    position: relative;
    padding: 10px;
    width: 600px;
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

    .preview-head {
      position: relative;
      height: 32px;
      background-color: white;

      .logo {
        height: 100%;
        width: 20%;
        background-color: #111629;
        color: #dbdcdf;
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 100%;
        }

        // img {
        //   width: 100%;
        //   height: 100%;
        // }
      }
    }

    .preview-main {
      position: relative;
      margin: 0;
      height: 306px;
      background-color: #f2f3f7;
      overflow: hidden;

      .side {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 20%;
        background-color: #1a213b;

        ul {
          padding: 20px 10px;
        }
        li {
          margin-bottom: 10px;
          height: 10px;
          background-color: #dadfec;
        }
      }
      .content {
        margin-left: 22%;
        padding: 20px 10px;

        ul {
        }
        li {
          margin: 0 10px 10px 0;
          display: inline-block;
          width: 30.5%;
          height: 100px;
          background-color: #dadfec;
        }
      }
    }
  }
}
</style>
