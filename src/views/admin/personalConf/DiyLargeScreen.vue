<template>
  <div class="" style="padding:0 24px 24px">
    <!-- <iframe
      id="myframe"
      :src="iframeSrc"
      frameborder="0"
      style="width: 100%; height: 80vh"
    ></iframe> -->

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

      <div class="preview-main">
        <div class="nav_child com_system_title">{{ pname.text }}</div>

        <div class="side">
          <div
            style="
              width: 100px;
              height: 100px;
              background: #d5dae9;
              margin-top: 10px;
            "
            v-for="i in 3"
            :key="i"
          ></div>
        </div>
        <div class="side">
          <div
            style="
              width: 100px;
              height: 100px;
              background: #d5dae9;
              margin-top: 10px;
            "
            v-for="i in 3"
            :key="i"
          ></div>
        </div>
      </div>
    </div>

    <div style="width: 400px; margin-top: 20px">
      <el-form label-width="80px">
        <el-form-item label="标题名称">
          <el-input
            v-model="pname.text"
            minlength="1"
            maxlength="10"
            show-word-limit
            @input="changeInput"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="saveConf" type="primary" :disabled="!hasDiff"
      >保存当前配置</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue'

const props = defineProps({
    initData:{
        type:Object
    }
})

const emits = defineEmits(['update'])

const pname = ref({
    text: '',
    orgText: ''
})

const hasDiff = computed(()=>{
    return pname.value.text !== pname.value.orgText
})

const favIcon = computed(()=>{
    let esso = window.$store.state.value.user.personal.esso
    return esso.favicon
})

const iframeSrc = ref('')

const initConf = (data:any) => {
    pname.value = {
        text: data.title.title,
        orgText: data.title.title
    }
}

onMounted(()=>{
    iframeSrc.value = window.origin + '/visualization/#/device/' // window.origin+'/index.html?user='+$.valuestore.getters.userid+'#/csmb'
    console.log(iframeSrc.value)

    initConf(props.initData)

    // setInterval(function () {
    //   document.getElementById("myframe").contentWindow.location.reload(true);
    // },10000);
})

const saveConf = () => {
    if (pname.value.text === '') {
        $SDK.methods.message('标题名称不能为空', 'error')
        return
    }

    window.$Api()
    .ThemePersonalizationController.post_new.request({
        data: {
        title: pname.value.text,
        typeTitleEnum: 'SCREEN_title'
        }
    })
    .then(() => {
        pname.value.orgText = pname.value.text
        emits('update')
    })
}

const changeInput = (e:any) => {
    pname.value.text = e.replace(/[^\u4e00-\u9fa5\w]/g, '')
}


</script>
<style lang='scss' scoped>
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
    position: relative;
    margin: 0;
    height: 330px;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

    .side {
      // position: absolute;
      // left: 0;
      // top: 0;
      // bottom: 0;
      // width: 20%;

      // background-color: #a1a9bd;

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
    margin-left: 60%;
    padding: 27px;
    text-align: center;
    .logo {
      display: inline-block;
      margin: 12px 0 5px 0;
      width: 108px;
      height: 64px;
      background-color: #e2e4ea;
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

  .nav_child {
    display: inline-block;
  }
  .com_system_title {
    text-shadow: none;
  }
  .com_system_title {
    //   text-shadow: 0 0 3px #000;
    font-size: 20px;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    &:before {
      position: absolute;
      border-color: transparent transparent #1840a0;
      border-style: none solid solid;
      border-width: 0 4px 4px;
      content: "";
      display: block;
      height: 0;
      bottom: 1px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      z-index: -1;
    }
  }
  @media only screen and (max-width: 1366px) {
    .com_system_title:before {
      height: 30px;
      width: 300px;
    }
  }
}
</style>
