<template>
  <div>
    <div class="gallery">
      <div
        class="item"
        v-for="item in fileList"
        :key="item.id"
        @click="setCurrImg(item)"
      >
        <!-- <img :src="item.url" :class="{ 'cen': imgAlign}" /> -->
        <el-image
          class="item"
          :src="item.url"
          :fit="role==='favicon'?'none':'cover'"
          v-if="item.type == 'img'"
        ></el-image>
        <video
          :src="item.url"
          v-if="item.type == 'video'"
          class="item"
          autoplay
        ></video>
        <div class="ms">
            <el-icon><Check /></el-icon>
        </div>
        <div class="mt">
          <span class="owner">
            <el-icon><UserFilled /></el-icon>
            {{ item.owner }}
          </span>
          <span class="rm">
            <el-icon @click.stop="removeImage(item.id)"><DeleteFilled /></el-icon>
          </span>
        </div>
      </div>
      <div class="empty" v-if="fileList.length == 0">
        <span>当前没有图片供选择，请先上传图片</span>
      </div>
    </div>
    <!--action="https://jsonplaceholder.typicode.com/posts/"-->
    <el-upload
      class="upload-section"
      name="file"
      :accept="accept"
      :action="uploadUrl"
      :data="params"
      :headers="headers"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :show-file-list="false"
    >
      <!--:before-remove="beforeRemove"-->
      <!--:limit="1"-->
      <el-button
        type="primary"
        plain
        icon="Loading"
        size="default"
        disabled
        v-if="isUploading"
        >上传中...</el-button
      >
      <el-button type="primary" plain icon="UploadFilled" size="default" v-else
        >
        <template v-if="role=='backgroundImage'">
          上传图片/视频
        </template>
        <template v-else>
          上传图片
        </template>
        </el-button
      >
      <template v-slot:tip>
        <div class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>

  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    tip: {
      type: String,
      default: '只能上传jpg/png文件，且不超过500kb'
    },
    sizeLimit: {
      type: Number,
      default: 500
    },
    widthLimit: {
      type: Number,
      default: 0
    },
    heightLimit: {
      type: Number,
      default: 0
    },
    // 图片所属系统：登录页esso、综合门户portal等
    system: {
      type: String,
      required: true
    },
    // 图片的角色：logo、imageMap、backgroundImage、favicon
    role: {
      type: String,
      required: true
    },
    // 限制图片文件类型
    accept: {
      type: String,
      default: '.jpg,.jpeg,.png,.JPG,.JPEG,.mp4,.MP4'
    },
    // 图片居中
    imgAlign: {
      type: Boolean,
      default: false
    }
})

const currImg = ref<Recordable>({
    id: '',
    url: '',
    type: 'img'
})

const emits = defineEmits(['choosed'])

watch(()=>currImg.value.url,(val)=>{
    emits('choosed', { url: val, id: currImg.value.id, type: currImg.value.type })
})

const uploadUrl = computed(() => {
    return window.$Api().ThemePersonalizationController.post_personalizedFiles
    .originalUrl
})

// 上传文件附带参数
const params = computed(() => {
      return { type: props.role, system: props.system }
})

// 图片容器高度
const itemHeight = computed(() => {
    if (props.widthLimit > 0 && props.heightLimit > 0 && !props.imgAlign) {
    return parseInt((146 * props.heightLimit) / props.widthLimit)
    } else {
    return 126
    }
})

// 是否具有最高权限
const isPowerful = () => {
    return $store.state.user.entityAuthority === 'SYS_ADMIN'
}

const handleRemove = (file:any, fileList:any) => {
    console.log(file, fileList)
}

const handleExceed = (files:any, fileList:any) => {
    ElMessage.warning(
    `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
        files.length + fileList.length
    } 个文件`
    )
}

// 正在上传中
const isUploading = ref(false)

const handleBeforeUpload = (file:any) => {
    console.log(file)
    let size = props.sizeLimit
    let arr = props.accept.split(',')
    isUploading.value = true
    // 文件类型
    if (arr.indexOf('.' + file.name.split('.')[1]) < 0) {
    ElMessage({
        message: `请上传以下格式的图片：${props.accept.replace(/,/gi, ' ')}`,
        type: 'warning'
    })
    isUploading.value = false
    return false
    }
    // 文件体积
    if (size && file.size > 1024 * size) {
    ElMessage({
        message: `请上传文件大小在${size}KB以内的图片`,
        type: 'warning'
    })
    isUploading.value = false
    return false
    }
    // 文件尺寸
    if (props.widthLimit > 0) {
    return new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function () {
        if (img.width === props.widthLimit && img.height === props.heightLimit) {
            resolve()
        } else {
            ElMessage({
            message: `请上传尺寸为${props.widthLimit}px*${props.heightLimit}px的图片`,
            type: 'warning'
            })
            isUploading.value = false
            reject(new Error('error'))
        }
        }
        img.src = _URL.createObjectURL(file)
    })
    } else {
    return true
    }
}

// 库存图片 id url
const fileList = ref<Recordable>([])

 // 获得当前类型图片地址数组
const getImagesList = () => {
    window.$Api()
    .ThemePersonalizationController.get_personalizedFiles.request({
        params: {
        type: props.role,
        system: props.system
        }
    })
    .then((data:any) => {
        // 整理列表数据
        let arr:Recordable = []
        data.forEach((item:any) => {
        if (!item.defaultFile) {
            arr.push({
            id: item.id,
            url: item.link,
            type:
                item.personalizationKey.indexOf('.mp4') != -1
                ? 'video'
                : 'img',
            // 当前图片使用中
            enable: item.item === true,
            // 上传者
            owner: item.updateUser
            // 当前图片是否可删除 ，SYS_ADMIN可删除所有图片
            // deletable: this.isPowerful || item.defaultFile !== true
            })
        }
        })
        fileList.value = arr
    })
}

onMounted(()=>{
    getImagesList()
})

const setCurrImg = (item:any) => {
    if (item.id === currImg.value.id) {
    return
    }
    currImg.value.url = item.url
    currImg.value.id = item.id
    currImg.value.type = item.type

    emits('choosed', { url: item.url, id: item.id, type: item.type })
}

const handleError = (err:any, file?:any) => {
    if (err.status === '403') {
    err.message = '会话过期，无操作权限，请重新登录'
    }
    isUploading.value = false
    ElMessage({
    message: err.msg || '文件上传失败，请重试',
    type: 'error'
    })
}

const handleSuccess = (res:any, file:any, fileList:any) => {
    isUploading.value = false
    if (res.code === '1') {
    ElMessage({ message: res.msg || '文件上传成功', type: 'success' })
    getImagesList()
    } else if (res.code === '0') {
    handleError(res)
    }
}

const removeImage = (id:any) => {
    window.$Api()
    .ThemePersonalizationController.delete_personalizedFiles.request({
        path: {
        ids: id
        }
    })
    .then(() => {
        if (id === currImg.value.id) {
        setCurrImg({})
        }
        getImagesList()
    })
}

const headers = ref<Recordable>({
    Authorization: $SDK.userInfo.token
})

</script>

<style  lang="scss">
.gallery {
  padding: 0 0 1.5em;
  width: 900px;

  .item {
    position: relative;
    margin: 0 1em 1em 0;
    display: inline-block;
    width: 146px;
    height: 126px;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    background-color: #555;
    vertical-align: middle;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .cen {
      position: absolute;
      top: 50%;
      left: 50%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
    }
    .ms {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      text-align: center;
      color: #fff;
      font-size: 24px;
      opacity: 0;
      transition: all 0.3s ease-in-out;
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .mt {
      position: absolute;
      bottom: 8px;
      right: 8px;
      left: 8px;
      color: #fff;
      text-align: right;
      .owner {
        float: left;
      }
      .rm {
        opacity: 0;
        padding: 5px;
        border-radius: 50%;
        width: 14px;
        height: 14px;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }

    &:hover .ms {
      opacity: 1;
    }
    &:hover .mt .rm {
      opacity: 1;
    }
    &:hover .mt .rm:hover {
      background-color: rgba(64, 158, 255, 1);
    }
  }
  .item[isIcon] {
    background-size: auto;
  }

  .empty {
    margin: 0 0 10px;
    padding: 1em 2em;
    width: 300px;
    background-color: #f0f0f0;
    border: 2px dashed #999;
    border-radius: 3px;
    color: #999;
  }
}

.el-pagination {
  padding: 0;
  min-height: 32px;
  text-align: left;
}
.el-pagination .el-pagination__total {
  float: left;
}
.el-pagination .el-pagination__sizes {
  float: left;
}

.upload-section {
  padding: 0 0 2em;
  width: 640px;
}
.el-upload__tip {
    font-size: 14px;
    color: #0c1014;
    margin-top: 7px;
}
</style>
